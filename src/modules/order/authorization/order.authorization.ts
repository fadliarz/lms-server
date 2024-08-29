import { injectable } from "inversify";
import { IOrderAuthorization } from "../order.interface";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { OrderModel } from "../order.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class OrderAuthorization
  extends BaseAuthorization
  implements IOrderAuthorization
{
  public authorizeCreateOrder(
    user: UserModel,
    id: { targetUserId: number },
  ): void {
    let isAuthorized = user.id === id.targetUserId;

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetOrders(user: UserModel): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      isAuthorized = await this.authorizeFromPrivilege(user);
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeGetOrderById(
    user: UserModel,
    order: Pick<OrderModel, "userId">,
  ): Promise<void> {
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    let isAuthorized = false;
    if (isStudent) {
      if (user.id === order.userId) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromPrivilege(user);
      }
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateOrderArrivedStatus(
    user: UserModel,
  ): Promise<void> {
    await this.authorizeGetOrders(user);
  }

  public async authorizeDeleteOrder(
    user: UserModel,
    order: OrderModel | null,
  ): Promise<void> {
    let isAuthorized = false;
    const { isStudent, isAdmin } = getRoleStatus(user.role);

    if (isStudent) {
      if (order === null) {
        const isManager = await this.authorizeFromPrivilege(user);

        throw isManager
          ? new RecordNotFoundException()
          : new AuthorizationException();
      }

      if (user.id === order.userId && !order.isArrived && !order.receipt) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        isAuthorized = await this.authorizeFromPrivilege(user);
      }
    }

    if (isAdmin) {
      if (order === null) throw new RecordNotFoundException();

      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  private async authorizeFromPrivilege(user: UserModel): Promise<boolean> {
    return this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
      { userId: user.id },
      PrivilegeModel.STORE,
    );
  }
}
