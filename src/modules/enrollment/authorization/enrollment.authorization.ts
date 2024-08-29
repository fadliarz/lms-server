import { CourseEnrollmentModel } from "../enrollment.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { CourseEnrollmentRoleModel } from "../../course/course.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { injectable } from "inversify";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import { UserModel } from "../../user/user.type";
import { ICourseEnrollmentAuthorization } from "../enrollment.interface";
import { $CourseEnrollmentAPI } from "../enrollment.api";

@injectable()
export default class CourseEnrollmentAuthorization
  implements ICourseEnrollmentAuthorization
{
  public authorizeCreateEnrollment(
    user: UserModel,
    dto: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ): void {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      if (
        user.id == dto.userId &&
        isEqualOrIncludeCourseEnrollmentRole(dto.role, [
          CourseEnrollmentRoleModel.STUDENT,
        ])
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

  public authorizeUpdateEnrollmentRole(user: UserModel): void {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeDeleteEnrollment(
    user: UserModel,
    enrollment: CourseEnrollmentModel,
  ): void {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent && user.id == enrollment.userId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }
}
