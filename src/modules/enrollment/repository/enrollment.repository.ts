import "reflect-metadata";
import { CourseEnrollment, Prisma, User } from "@prisma/client";
import {
  CourseEnrollmentDITypes,
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
  UserRoleModel,
} from "../../course/course.type";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import PrismaPromise from "../../../common/class/prisma_promise/PrismaPromise";
import { PrismaPromiseDITypes } from "../../../common/class/prisma_promise/prisma_promise.type";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";

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

// TODO : Implement MAX_RETRIES if transaction failed or timed out!

@injectable()
export default class CourseEnrollmentRepository
  implements ICourseEnrollmentRepository
{
  @inject(CourseEnrollmentDITypes.AUTHORIZATION)
  private readonly authorization: CourseEnrollmentAuthorization;

  @inject(PrismaPromiseDITypes.PRISMA_PROMISE)
  private readonly prismaPromise: PrismaPromise;

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
        );
        const course =
          await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
            tx,
            courseId,
          );

        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
        if (!(isStudent || isInstructor || isAdmin)) {
          throw new InternalServerException();
        }

        this.authorization.authorizeCreateEnrollment(user, course, dto);

        /**
         *
         * At this point, user is authorized to create enrollment.
         *
         * validate the create enrollment logic.
         *
         */
        let targetUser: User = user;
        const isUserIdEqual = userId === targetUserId;
        if (!isUserIdEqual) {
          targetUser =
            await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
              tx,
              targetUserId,
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
          throw new ClientException("Enrollment already exists!");
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
          throw new ClientException();
        }

        /**
         * Author shouldn't be enrolled
         *
         */
        if (course.authorId === dto.userId) {
          throw new ClientException();
        }

        const [newEnrollment] = await Promise.all([
          tx.courseEnrollment.create({
            data: {
              ...dto,
              courseId,
            },
          }),
          isEqualOrIncludeCourseEnrollmentRole(
            dto.role,
            CourseEnrollmentRoleModel.STUDENT,
          )
            ? this.prismaPromise.course.incrementTotalStudents(tx, courseId, 1)
            : this.prismaPromise.course.incrementTotalInstructors(
                tx,
                courseId,
                1,
              ),
        ]);

        return newEnrollment;
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
        );
        const course =
          await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
            tx,
            courseId,
          );
        const enrollment =
          await this.prismaQueryRaw.courseEnrollment.selectForUpdateByIdOrThrow(
            tx,
            enrollmentId,
          );

        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
        if (!(isStudent || isInstructor || isAdmin)) {
          throw new InternalServerException();
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
         */
        let targetUser: User = user;
        const isUserIdEqual = userId === enrollment.userId;
        if (!isUserIdEqual) {
          targetUser =
            await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
              tx,
              enrollment.userId,
            );
        }

        /**
         * Check for unexpected scenario
         *
         */
        if (
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new InternalServerException();
        }

        if (enrollment.role === dto.role) {
          return enrollment;
        }

        if (
          isEqualOrIncludeCourseEnrollmentRole(
            dto.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new ClientException();
        }

        const [updatedEnrollment] = await Promise.all([
          tx.courseEnrollment.update({
            where: {
              id: enrollmentId,
            },
            data: dto,
          }),
          ...(isEqualOrIncludeCourseEnrollmentRole(
            dto.role,
            CourseEnrollmentRoleModel.STUDENT,
          )
            ? [
                this.prismaPromise.course.incrementTotalStudents(
                  tx,
                  courseId,
                  1,
                ),
                this.prismaPromise.course.incrementTotalInstructors(
                  tx,
                  courseId,
                  -1,
                ),
              ]
            : [
                this.prismaPromise.course.incrementTotalStudents(
                  tx,
                  courseId,
                  -1,
                ),
                this.prismaPromise.course.incrementTotalInstructors(
                  tx,
                  courseId,
                  1,
                ),
              ]),
        ]);

        return updatedEnrollment;
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
        );
        const course =
          await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
            tx,
            courseId,
          );
        const enrollment =
          await this.prismaQueryRaw.courseEnrollment.selectForUpdateByIdOrThrow(
            tx,
            enrollmentId,
          );

        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
        if (!(isStudent || isInstructor || isAdmin)) {
          throw new InternalServerException();
        }

        this.authorization.authorizeDeleteEnrollment(user, course, enrollment);

        /**
         *
         * At this point, user is authorized to update enrollment.
         *
         * validate the update enrollment logic.
         *
         */
        let targetUser: User = user;
        const isUserIdEqual = userId === enrollment.userId;
        if (!isUserIdEqual) {
          targetUser =
            await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
              tx,
              enrollment.userId,
            );
        }

        /**
         * Check for unexpected scenario
         *
         */
        if (
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ) &&
          isEqualOrIncludeRole(targetUser.role, UserRoleModel.STUDENT)
        ) {
          throw new InternalServerException();
        }

        const [deletedEnrollment] = await Promise.all([
          tx.courseEnrollment.delete({
            where: {
              id: enrollmentId,
            },
          }),
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.STUDENT,
          )
            ? this.prismaPromise.course.incrementTotalStudents(tx, courseId, -1)
            : this.prismaPromise.course.incrementTotalInstructors(
                tx,
                courseId,
                -1,
              ),
        ]);

        return deletedEnrollment;
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
