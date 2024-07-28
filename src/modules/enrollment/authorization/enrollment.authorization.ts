import {
  CourseEnrollmentModel,
  CreateCourseEnrollmentDto,
} from "../enrollment.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { CourseModel, UserRoleModel } from "../../course/course.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { CourseEnrollment, CourseEnrollmentRole } from "@prisma/client";
import { injectable } from "inversify";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import { UserModel } from "../../user/user.type";

export interface ICourseEnrollmentAuthorization {
  authorizeCreateEnrollment: (
    user: UserModel,
    course: CourseModel,
    dto: CreateCourseEnrollmentDto,
  ) => void;
  authorizeUpdateEnrollmentRole: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollment,
  ) => void;
  authorizeDeleteEnrollment: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel,
  ) => void;
}

@injectable()
export default class CourseEnrollmentAuthorization {
  public authorizeCreateEnrollment(
    user: UserModel,
    course: CourseModel,
    dto: CreateCourseEnrollmentDto,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isUserIdEqual = userId === dto.userId;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
      if (isAuthor) {
        throw new InternalServerException();
      }

      if (
        isUserIdEqual &&
        isEqualOrIncludeRole(dto.role, [UserRoleModel.STUDENT])
      ) {
        isAuthorized = true;
      }
    }

    if (isInstructor) {
      if (
        isUserIdEqual &&
        !isAuthor &&
        isEqualOrIncludeCourseEnrollmentRole(dto.role, [
          CourseEnrollmentRole.STUDENT,
        ])
      ) {
        isAuthorized = true;
      }
    }

    if (isAdmin) {
      if (!(isUserIdEqual && isAuthor)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateEnrollmentRole(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel,
  ): void {
    const { id: userId, role: userRole } = user;
    const { userId: targetUserId } = enrollment;
    const { authorId } = course;
    const isUserIdEqual = userId === targetUserId;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

    if (course.authorId === enrollment.userId) {
      throw new InternalServerException();
    }

    if (isStudent) {
      if (isAuthor) {
        throw new InternalServerException();
      }
    }

    if (isInstructor) {
      if (!isUserIdEqual && isAuthor) {
        isAuthorized = true;
      }
    }

    if (isAdmin) {
      if (!(isUserIdEqual && isAuthor)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeDeleteEnrollment(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel,
  ): void {
    const { id: userId, role: userRole } = user;
    const { userId: targetUserId } = enrollment;
    const { authorId } = course;
    const isUserIdEqual = userId === targetUserId;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

    if (course.authorId === enrollment.userId) {
      throw new InternalServerException();
    }

    if (isStudent) {
      if (isAuthor) {
        throw new InternalServerException();
      }

      if (isUserIdEqual) {
        isAuthorized = true;
      }
    }

    if (isInstructor) {
      if ((isUserIdEqual && !isAuthor) || (!isUserIdEqual && isAuthor)) {
        isAuthorized = true;
      }
    }

    if (isAdmin) {
      if (!(isUserIdEqual && isAuthor)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }
}
