import { injectable } from "inversify";
import { ICourseClassAssignmentAuthorization } from "../assignment.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { UserModel } from "../../user/user.type";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
} from "../../course/course.type";
import { CourseEnrollmentModel } from "../../enrollment/enrollment.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class CourseClassAssignmentAuthorization
  extends BaseAuthorization
  implements ICourseClassAssignmentAuthorization
{
  public authorizeCreateAssignment(
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

  public authorizeReadAssignment(
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

  public authorizeUpdateAssignment(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateAssignment(user, course, enrollment);
  }

  public authorizeDeleteAssignment(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateAssignment(user, course, enrollment);
  }
}
