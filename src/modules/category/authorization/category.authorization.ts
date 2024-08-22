import "reflect-metadata";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseCategoryAuthorization } from "../category.interface";
import { injectable } from "inversify";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

@injectable()
export default class CourseCategoryAuthorization
  extends BaseAuthorization
  implements ICourseCategoryAuthorization
{
  public async authorizeCreateCategory(user: UserModel): Promise<void> {
    const { isAdmin, isStudent } = getRoleStatus(user.role);
    let isAuthorized = false;
    if (isStudent) {
      isAuthorized = await this.authorizeFromDepartmentDivision(
        user.id,
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

  public async authorizeUpdateCategory(user: UserModel): Promise<void> {
    await this.authorizeCreateCategory(user);
  }

  public async authorizeDeleteCategory(user: UserModel): Promise<void> {
    await this.authorizeCreateCategory(user);
  }
}
