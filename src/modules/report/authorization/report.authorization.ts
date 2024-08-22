import { injectable } from "inversify";
import { IReportAuthorization } from "../report.interface";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class ReportAuthorization
  extends BaseAuthorization
  implements IReportAuthorization
{
  public async authorizeGetReports(user: UserModel): Promise<void> {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized =
        await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
          { userId },
          PrivilegeModel.REPORT,
        );
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetReportById(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;

    if (isStudent) {
      if (user.id === targetUserId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromDepartmentDivision(
          user.id,
          PrivilegeModel.REPORT,
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

  public async authorizeUpdateReport(
    user: UserModel,
    targetUserId: number,
  ): Promise<void> {
    await this.authorizeGetReportById(user, targetUserId);
  }
}
