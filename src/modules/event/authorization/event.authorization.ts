import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { IEventAuthorization } from "../event.interface";

@injectable()
export default class EventAuthorization
  extends BaseAuthorization
  implements IEventAuthorization
{
  public authorizeCreateEvent(user: UserModel): void {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor || isAdmin) {
      true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeReadEvent(user: UserModel): void {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);

    let isAuthorized = false;
    if (isStudent || isInstructor || isAdmin) {
      true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeReadEvents(user: UserModel): void {
    this.authorizeReadEvent(user);
  }

  public authorizeUpdateEvent(user: UserModel): void {
    this.authorizeCreateEvent(user);
  }

  public authorizeDeleteEvent(user: UserModel): void {
    this.authorizeCreateEvent(user);
  }
}
