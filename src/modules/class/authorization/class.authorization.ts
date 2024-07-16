import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { ICourseClassAuthorization } from "../class.type";
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
export default class CourseClassAuthorization
  extends BaseAuthorization
  implements ICourseClassAuthorization
{
  public authorizeCreateClass(
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

  public authorizeUpdateClass(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateClass(user, course, enrollment);
  }

  public authorizeDeleteClass(
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ): void {
    this.authorizeCreateClass(user, course, enrollment);
  }
}
