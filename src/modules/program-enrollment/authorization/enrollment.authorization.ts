import { IDepartmentProgramEnrollmentAuthorization } from "../enrollment.interface";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { DepartmentProgramEnrollmentModel } from "../enrollment.type";
import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

@injectable()
export default class DepartmentProgramEnrollmentAuthorization
  extends BaseAuthorization
  implements IDepartmentProgramEnrollmentAuthorization
{
  public async authorizeCreateEnrollment(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      if (user.id === targetUserId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromDepartmentDivision(
          user.id,
          PrivilegeModel.PROGRAM,
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

  public async authorizeDeleteEnrollment(
    user: UserModel,
    enrollment: DepartmentProgramEnrollmentModel,
  ): Promise<void> {
    const { id: userId, role } = user;
    const { isStudent, isAdmin } = getRoleStatus(role);

    let isAuthorized = false;
    if (isStudent) {
      if (user.id === enrollment.userId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromDepartmentDivision(
          user.id,
          PrivilegeModel.PROGRAM,
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
}
