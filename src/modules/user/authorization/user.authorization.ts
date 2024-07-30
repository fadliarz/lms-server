import "reflect-metadata";
import { injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { UserModel } from "../user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { IUserAuthorization } from "../user.interface";

@injectable()
export default class UserAuthorization
  extends BaseAuthorization
  implements IUserAuthorization
{
  public authorizeGetUserAssignments(
    user: UserModel,
    targetUserId: number,
  ): void {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;

    if ((isStudent || isInstructor) && userId === targetUserId) {
      isAuthorized = true;
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateUser(user: UserModel, targetUserId: number): void {
    this.authorizeGetUserAssignments(user, targetUserId);
  }

  public authorizeDeleteUser(user: UserModel, targetUserId: number): void {
    this.authorizeGetUserAssignments(user, targetUserId);
  }
}
