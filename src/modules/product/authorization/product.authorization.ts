import { IProductAuthorization } from "../product.interface";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { injectable } from "inversify";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";

@injectable()
export default class ProductAuthorization
  extends BaseAuthorization
  implements IProductAuthorization
{
  public async authorizeCreateProduct(user: UserModel): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized =
        await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
          { userId: user.id },
          PrivilegeModel.STORE,
        );
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateProduct(user: UserModel): Promise<void> {
    await this.authorizeCreateProduct(user);
  }

  public async authorizeDeleteProduct(user: UserModel): Promise<void> {
    await this.authorizeCreateProduct(user);
  }
}
