import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { ICompetitionAuthorization } from "../competition.interface";
import { injectable } from "inversify";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class CompetitionAuthorization
  extends BaseAuthorization
  implements ICompetitionAuthorization
{
  public async authorizeCreateCompetition(user: UserModel): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized = await this.authorizeFromDepartmentDivision(
        user.id,
        PrivilegeModel.COMPETITION,
      );
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateCompetition(user: UserModel): Promise<void> {
    await this.authorizeCreateCompetition(user);
  }

  public async authorizeDeleteCompetition(user: UserModel): Promise<void> {
    await this.authorizeCreateCompetition(user);
  }
}
