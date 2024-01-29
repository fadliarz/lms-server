import { CreateCourseEnrollmentDto } from "../enrollment.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { UserRoleModel } from "../../course/course.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { Course, CourseEnrollment, User } from "@prisma/client";
import { injectable } from "inversify";

export interface ICourseEnrollmentAuthorization {
  authorizeCreateEnrollment: (
    user: User,
    course: Course,
    dto: CreateCourseEnrollmentDto,
  ) => void;
  authorizeUpdateEnrollmentRole: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment,
  ) => void;
  authorizeDeleteEnrollmentRole: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment,
  ) => void;
}

@injectable()
export default class CourseEnrollmentAuthorization {
  public authorizeCreateEnrollment(
    user: User,
    course: Course,
    dto: CreateCourseEnrollmentDto,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isUserIdEqual = userId === dto.userId;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
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
        isEqualOrIncludeRole(dto.role, [UserRoleModel.STUDENT])
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
    user: User,
    course: Course,
    enrollment: CourseEnrollment,
  ): void {
    const { id: userId, role: userRole } = user;
    const { userId: targetUserId } = enrollment;
    const { authorId } = course;
    const isUserIdEqual = userId === targetUserId;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
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
    user: User,
    course: Course,
    enrollment: CourseEnrollment,
  ): void {
    const { id: userId, role: userRole } = user;
    const { userId: targetUserId } = enrollment;
    const { authorId } = course;
    const isUserIdEqual = userId === targetUserId;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

    if (isStudent) {
      if (isUserIdEqual) {
        isAuthorized = true;
      }
    }

    if (isInstructor) {
      if ((isUserIdEqual && !isAuthor) || (!isUserIdEqual && isAuthorized)) {
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

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }
}
