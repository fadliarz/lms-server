import getRoleStatus from "../../../common/functions/getRoleStatus";
import { CourseEnrollmentRoleModel } from "../../course/course.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { injectable } from "inversify";
import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import { ICourseEnrollmentAuthorization } from "../enrollment.interface";
import { $CourseEnrollmentAPI } from "../enrollment.api";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

@injectable()
export default class CourseEnrollmentAuthorization
  extends BaseAuthorization
  implements ICourseEnrollmentAuthorization
{
  public async authorizeCreateEnrollment(
    user: UserModel,
    dto: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<void> {
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

      if (!isAuthorized) {
        isAuthorized =
          await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
            { userId: user.id },
            PrivilegeModel.COURSE,
          );
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateEnrollmentRole(user: UserModel): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized =
        await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
          { userId: user.id },
          PrivilegeModel.COURSE,
        );
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeDeleteEnrollment(
    user: UserModel,
    enrollmentId: number,
  ): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      const enrollment =
        await this.globalRepository.courseEnrollment.getEnrollmentById(
          enrollmentId,
        );

      if (enrollment?.userId == user.id) {
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
}
