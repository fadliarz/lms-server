import "reflect-metadata";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseCategoryAuthorization } from "../category.interface";
import { injectable } from "inversify";
import { UserModel } from "../../user/user.type";

@injectable()
export default class CourseCategoryAuthorization
  implements ICourseCategoryAuthorization
{
  public authorizeCreateCategory(user: UserModel): void {
    const { id: userId, role: userRole } = user;
    const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
    let isAuthorized = false;
    if (isStudent) {
    }

    if (isInstructor || isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public authorizeUpdateCategory(user: UserModel): void {
    this.authorizeCreateCategory(user);
  }
}
