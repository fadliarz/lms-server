import { inject, injectable } from "inversify";
import {
  IOrderAuthorization,
  IOrderRepository,
  IOrderService,
} from "../order.interface";
import {
  OrderDITypes,
  OrderErrorMessage,
  OrderResourceId,
} from "../order.type";
import { UserModel } from "../../user/user.type";
import { $OrderAPI } from "../order.api";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import BaseService from "../../../common/class/BaseService";
import { PrismaDefaultTransactionConfigForWrite } from "../../../common/constants/prismaDefaultConfig";
import asyncLocalStorage from "../../../common/asyncLocalStorage";
import { LocalStorageKey } from "../../../common/constants/LocalStorageKey";
import ClientException from "../../../common/class/exceptions/ClientException";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class OrderService extends BaseService implements IOrderService {
  @inject(OrderDITypes.REPOSITORY)
  private readonly repository: IOrderRepository;

  @inject(OrderDITypes.AUTHORIZATION)
  private readonly authorization: IOrderAuthorization;

  public async createOrder(
    user: UserModel,
    id: {
      variantId: number;
      resourceId: Omit<OrderResourceId, "variantId">;
    },
    dto: $OrderAPI.CreateOrder.Dto,
  ): Promise<$OrderAPI.CreateOrder.Response["data"]> {
    try {
      this.authorization.authorizeCreateOrder(user, {
        targetUserId: dto.userId,
      });

      return await this.transactionManager.initializeTransaction<
        $OrderAPI.CreateOrder.Response["data"]
      >(async (tx) => {
        const variant = await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.globalRepository.productVariant.getVariantByIdOrThrow(
              id,
            );
          },
        );

        if (variant.stock != null && variant.stock < 1) {
          throw new ClientException(OrderErrorMessage.OUT_OF_STOCK);
        }

        if (variant.stock != null) {
          await asyncLocalStorage.run(
            { [LocalStorageKey.TRANSACTION]: tx },
            async () => {
              return this.globalRepository.productVariant.updateVariant(id, {
                stock: variant.stock! - 1,
              });
            },
          );
        }

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.createOrder(id, dto);
          },
        );
      }, PrismaDefaultTransactionConfigForWrite);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getOrders(
    user: UserModel,
    id: {
      variantId: number;
      resourceId: Omit<OrderResourceId, "variantId">;
    },
  ): Promise<$OrderAPI.GetOrders.Response["data"]> {
    try {
      await this.authorization.authorizeGetOrders(user);

      return await this.repository.getOrders(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getOrderById(
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
  ): Promise<$OrderAPI.GetOrderById.Response["data"]> {
    try {
      const order = await this.repository.getOrderById(id);

      await this.authorization.authorizeGetOrderById(user, {
        userId: order === null ? user.id + 1 : order.userId,
      });

      if (!order) {
        throw new RecordNotFoundException();
      }

      return order;
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateOrderArrivedStatus(
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
    dto: $OrderAPI.UpdateOrderArrivedStatus.Dto,
  ): Promise<$OrderAPI.UpdateOrderArrivedStatus.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateOrderArrivedStatus(user);

      if (dto.isArrived) {
        return await this.repository.updateOrder(id, {
          isArrived: true,
          arrivedAt: new Date(),
        });
      }

      return await this.repository.updateOrder(id, {
        isArrived: false,
        arrivedAt: null,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteOrder(
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
  ): Promise<$OrderAPI.DeleteOrder.Response["data"]> {
    try {
      const order = await this.repository.getOrderById(id);

      await this.authorization.authorizeDeleteOrder(user, order);

      return await this.repository.deleteOrder({ orderId: id.orderId });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
