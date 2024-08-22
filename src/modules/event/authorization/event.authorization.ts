import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { IEventAuthorization } from "../event.interface";

@injectable()
export default class EventAuthorization
  extends BaseAuthorization
  implements IEventAuthorization
{
  public async authorizeCreateEvent(user: UserModel): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized = await this.authorizeFromDepartmentDivision(
        user.id,
        PrivilegeModel.EVENT,
      );
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateEvent(user: UserModel): Promise<void> {
    await this.authorizeCreateEvent(user);
  }

  public async authorizeDeleteEvent(user: UserModel): Promise<void> {
    await this.authorizeCreateEvent(user);
  }
}
