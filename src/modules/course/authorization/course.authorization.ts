import "reflect-metadata";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { injectable } from "inversify";
import { UserModel } from "../../user/user.type";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
  ICourseAuthorization,
} from "../course.type";
import { CourseEnrollmentModel } from "../../enrollment/enrollment.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";

@injectable()
export class CourseAuthorization
  extends BaseAuthorization
  implements ICourseAuthorization
{
  public authorizeCreateCourse(user: UserModel): void {
    const { id: userId, role: userRole } = user;
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor || isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateBasicCourse(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);

    this.validateUnexpectedScenarios(user, course, enrollment);

    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor) {
      if (
        isAuthor ||
        (enrollment &&
          isEqualOrIncludeCourseEnrollmentRole(
            enrollment.role,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ))
      ) {
        isAuthorized = true;
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeDeleteCourse(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);

    this.validateUnexpectedScenarios(user, course, enrollment);

    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor) {
      if (isAuthor) {
        isAuthorized = true;
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeCreateLike(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    const { id: userId, role: userRole } = user;
    const { authorId } = course;
    const isAuthor = userId === authorId;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);

    this.validateUnexpectedScenarios(user, course, enrollment);

    let isAuthorized = false;
    if (isStudent || isInstructor || isAdmin) {
      if (
        enrollment &&
        isEqualOrIncludeCourseEnrollmentRole(
          enrollment.role,
          CourseEnrollmentRoleModel.STUDENT,
        )
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeDeleteLike(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    return this.authorizeCreateLike(user, course, enrollment);
  }
}
