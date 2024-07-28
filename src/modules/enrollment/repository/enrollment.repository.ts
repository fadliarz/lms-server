import "reflect-metadata";
import { CourseEnrollment, Prisma, User } from "@prisma/client";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentErrorMessage,
  CourseEnrollmentResourceId,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentRoleDto,
} from "../enrollment.type";
import { inject, injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import CourseEnrollmentAuthorization from "../authorization/enrollment.authorization";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import ClientException from "../../../common/class/exceptions/ClientException";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import {
  CourseEnrollmentRoleModel,
  CourseErrorMessage,
  UserRoleModel,
} from "../../course/course.type";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
import { UserModel } from "../../user/user.type";

export interface ICourseEnrollmentRepository {
  createEnrollment: (
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ) => Promise<CourseEnrollment>;
  updateEnrollmentRole: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ) => Promise<CourseEnrollment>;
  deleteEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ) => Promise<{}>;
}

@injectable()
export default class CourseEnrollmentRepository
  implements ICourseEnrollmentRepository
{
  @inject(CourseEnrollmentDITypes.AUTHORIZATION)
  private readonly authorization: CourseEnrollmentAuthorization;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createEnrollment(
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ): Promise<CourseEnrollment> {
    return await this.prisma.$transaction(
      async (tx) => {
        const { userId, courseId } = resourceId;
        const { userId: targetUserId, role: enrollmentRole } = dto;
        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new AuthenticationException(),
        );
        const course =
          await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
            tx,
            courseId,
            new RecordNotFoundException(
              CourseErrorMessage.COURSE_DOES_NOT_EXIST,
            ),
          );

        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
        if (!(isStudent || isInstructor || isAdmin)) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        this.authorization.authorizeCreateEnrollment(user, course, dto);

        /**
         *
         * At this point, user is authorized to create enrollment.
         *
         * validate the create enrollment logic.
         *
         */
        let targetUser: UserModel = user;
        const isUserIdEqual = userId === targetUserId;
        if (!isUserIdEqual) {
          targetUser =
            await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
              tx,
              targetUserId,
              new RecordNotFoundException(
                CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST,
              ),
            );
        }

        const existingTargetEnrollments =
          await this.prismaQueryRaw.courseEnrollment.selectForUpdateByUserIdAndCourseId(
            tx,
            {
              userId: targetUserId,
              courseId,
            },
          );

        if (existingTargetEnrollments) {
          throw new ClientException(
            CourseEnrollmentErrorMessage.TARGET_USER_IS_ALREADY_ENROLLED,
          );
        }

        /**
         * STUDENT shouldn't be enrolled as Instructor
         *
         */
        if (
          isEqualOrIncludeCourseEnrollmentRole(
            dto.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new ClientException(
            CourseEnrollmentErrorMessage.STUDENT_SHOULD_NOT_ENROLLED_AS_INSTRUCTOR,
          );
        }

        /**
         * Author shouldn't be enrolled
         *
         */
        if (course.authorId === dto.userId) {
          throw new ClientException(
            CourseEnrollmentErrorMessage.AUTHOR_SHOULD_NOT_BE_ENROLLED,
          );
        }

        return await tx.courseEnrollment.create({
          data: {
            ...dto,
            courseId,
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 8000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  public async updateEnrollmentRole(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ): Promise<CourseEnrollment> {
    return await this.prisma.$transaction(
      async (tx) => {
        const { userId, courseId } = resourceId;
        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new AuthenticationException(),
        );
        const course =
          await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
            tx,
            courseId,
            new RecordNotFoundException(
              CourseErrorMessage.COURSE_DOES_NOT_EXIST,
            ),
          );
        const enrollment =
          await this.prismaQueryRaw.courseEnrollment.selectForUpdateByIdOrThrow(
            tx,
            enrollmentId,
            new RecordNotFoundException(
              CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST,
            ),
          );

        /**
         * validate relation between resources
         *
         */
        if (course.id !== enrollment.courseId) {
          throw new RecordNotFoundException(
            CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST,
          );
        }

        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
        if (!(isStudent || isInstructor || isAdmin)) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        this.authorization.authorizeUpdateEnrollmentRole(
          user,
          course,
          enrollment,
        );

        /**
         *
         * At this point, user is authorized to update enrollment.
         *
         * validate the update enrollment logic.
         *
         * 1. target user is STUDENT but new enrollment role is INSTRUCTOR
         *
         */
        let targetUser: UserModel = user;
        const isUserIdEqual = userId === enrollment.userId;
        if (!isUserIdEqual) {
          targetUser =
            await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
              tx,
              enrollment.userId,
              new RecordNotFoundException(
                CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST,
              ),
            );
        }

        if (
          isEqualOrIncludeCourseEnrollmentRole(
            dto.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new ClientException(
            CourseEnrollmentErrorMessage.STUDENT_SHOULD_NOT_ENROLLED_AS_INSTRUCTOR,
          );
        }

        /**
         *
         * check for unexpected scenario.
         *
         * 1. target user is STUDENT but enrolled as INSTRUCTOR
         * 2. target user is author
         *
         */
        if (
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        if (targetUser.id === course.authorId) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        return await tx.courseEnrollment.update({
          where: {
            id: enrollmentId,
          },
          data: dto,
        });
      },
      {
        maxWait: 5000,
        timeout: 8000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  public async deleteEnrollment(
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(
      async (tx) => {
        const { userId, courseId } = resourceId;
        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new AuthenticationException(),
        );
        const course =
          await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
            tx,
            courseId,
            new RecordNotFoundException(
              CourseErrorMessage.COURSE_DOES_NOT_EXIST,
            ),
          );
        const enrollment =
          await this.prismaQueryRaw.courseEnrollment.selectForUpdateByIdOrThrow(
            tx,
            enrollmentId,
            new RecordNotFoundException(
              CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST,
            ),
          );

        /**
         * validate relation between resources
         *
         */
        if (course.id !== enrollment.courseId) {
          throw new RecordNotFoundException(
            CourseEnrollmentErrorMessage.ENROLLMENT_DOES_NOT_EXIST,
          );
        }

        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
        if (!(isStudent || isInstructor || isAdmin)) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        this.authorization.authorizeDeleteEnrollment(user, course, enrollment);

        /**
         * At this point, user is authorized to update enrollment.
         *
         */
        let targetUser: User = user;
        const isUserIdEqual = userId === enrollment.userId;
        if (!isUserIdEqual) {
          targetUser =
            await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
              tx,
              enrollment.userId,
              new RecordNotFoundException(
                CourseEnrollmentErrorMessage.TARGET_USER_DOES_NOT_EXIST,
              ),
            );
        }

        /**
         *
         * check for unexpected scenario
         *
         * 1. target user is STUDENT but enrolled as INSTRUCTOR
         * 2. target user is author
         *
         */
        if (
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        if (targetUser.id === course.authorId) {
          throw new InternalServerException(
            CourseEnrollmentErrorMessage.UNEXPECTED_SCENARIO,
          );
        }

        return await tx.courseEnrollment.delete({
          where: {
            id: enrollmentId,
          },
        });
      },
      {
        maxWait: 5000,
        timeout: 8000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );

    return {};
  }
}
