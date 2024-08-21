import "reflect-metadata";
import getRoleStatus from "../functions/getRoleStatus";
import isEqualOrIncludeCourseEnrollmentRole from "../functions/isEqualOrIncludeCourseEnrollmentRole";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
  UserRoleModel,
} from "../../modules/course/course.type";
import InternalServerException from "./exceptions/InternalServerException";
import { PrivilegeModel, UserModel } from "../../modules/user/user.type";
import { CourseEnrollmentModel } from "../../modules/enrollment/enrollment.type";
import { inject, injectable } from "inversify";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "./prisma_query_raw/prisma_query_raw.type";
import AuthenticationException from "./exceptions/AuthenticationException";
import RecordNotFoundException from "./exceptions/RecordNotFoundException";
import { PrismaTransaction } from "../types";
import { IRepository, RepositoryDITypes } from "./repository/repository.type";

export const BaseAuthorizationDITypes = Symbol.for(
  "COMMON_CLASS_BASE_AUTHORIZATION",
);

@injectable()
export default class BaseAuthorization {
  @inject(RepositoryDITypes.FACADE)
  protected readonly globalRepository: IRepository;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  protected readonly prismaQueryRaw: IPrismaQueryRaw;

  protected async authorizeFromDepartmentDivision(
    userId: number,
    privilege: PrivilegeModel,
  ): Promise<boolean> {
    return await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
      { userId },
      privilege,
    );
  }

  protected async isAuthor(userId: number, courseId: number): Promise<boolean> {
    const author =
      await this.globalRepository.course.getCourseAuthorByIdOrThrow(
        {
          courseId,
        },
        { minimalist: true },
      );

    return !!(author && author.id === userId);
  }

  public async authorizeUserRole(
    tx: PrismaTransaction,
    resourceId: {
      user: {
        id: number;
        role: UserRoleModel;
      };
    },
    fn: (user: UserModel) => void,
  ): Promise<UserModel> {
    const {
      user: { id: userId },
    } = resourceId;
    const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
      tx,
      userId,
      new AuthenticationException(),
    );

    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
    if (!isStudent && !isInstructor && !isAdmin) {
      throw new InternalServerException();
    }

    fn(user);

    return user;
  }

  public async authorize(
    tx: PrismaTransaction,
    resourceId: {
      user: {
        id: number;
        role: UserRoleModel;
      };
      courseId: number;
    },
    fn: (
      user: UserModel,
      course: CourseModel,
      enrollment: CourseEnrollmentModel | null,
    ) => void,
  ): Promise<{
    user: UserModel;
    course: CourseModel;
    enrollment: CourseEnrollmentModel | null;
  }> {
    const {
      user: { id: userId },
      courseId,
    } = resourceId;
    const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
      tx,
      userId,
      new AuthenticationException(),
    );
    const course = await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
      tx,
      courseId,
      new RecordNotFoundException("Course doesn't exist!"),
    );
    const enrollment =
      await this.prismaQueryRaw.courseEnrollment.selectForUpdateByUserIdAndCourseId(
        tx,
        {
          userId,
          courseId,
        },
      );

    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
    if (!isStudent && !isInstructor && !isAdmin) {
      throw new InternalServerException();
    }

    fn(user, course, enrollment);

    return {
      user,
      course,
      enrollment,
    };
  }

  public validateUnexpectedScenarios(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(userRole);

    if (!isStudent && !isInstructor && !isAdmin) {
      throw new InternalServerException();
    }

    /**
     * Some unexpected scenarios:
     *
     * 1. isStudent but enrolled as Instructor
     * 2. isStudent but also isAuthor
     * 3. isAuthor but also enrolled
     *
     */
    if (
      (isStudent &&
        enrollment &&
        isEqualOrIncludeCourseEnrollmentRole(
          enrollment.role,
          CourseEnrollmentRoleModel.INSTRUCTOR,
        )) ||
      (isStudent && isAuthor) ||
      (isAuthor && enrollment)
    ) {
      throw new InternalServerException();
    }
  }
}
