import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import { IOrderRepository } from "../order.interface";
import { $OrderAPI } from "../order.api";
import { OrderModel, OrderResourceId } from "../order.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class OrderRepository
  extends BaseRepository
  implements IOrderRepository
{
  constructor() {
    super();
  }

  public async createOrder(
    id: {
      variantId: number;
      resourceId?: Omit<OrderResourceId, "variantId">;
    },
    data: {
      variantSnapshot: $OrderAPI.BaseModel["variantSnapshot"];
    } & $OrderAPI.CreateOrder.Dto,
  ): Promise<OrderModel> {
    if (id.resourceId) {
      const variant = await this.db.productVariant.findFirst({
        where: { id: id.variantId, productId: id.resourceId.productId },
        select: { id: true },
      });

      if (!variant) {
        throw new RecordNotFoundException();
      }
    }

    return this.db.order.create({
      data: { ...data, variantId: id.variantId },
    });
  }

  public async getOrders(id: {
    variantId: number;
    resourceId?: Omit<OrderResourceId, "variantId">;
  }): Promise<OrderModel[]> {
    return this.db.order.findMany({
      where: this.getWhereObjectForFirstLevelOperation(id),
      include: { variant: true },
    });
  }

  public async getOrderById(id: {
    orderId: number;
    resourceId?: OrderResourceId;
  }): Promise<OrderModel | null> {
    return this.db.order.findFirst({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  public async getOrderByIdOrThrow(
    id: {
      orderId: number;
      resourceId?: OrderResourceId;
    },
    error?: Error,
  ): Promise<OrderModel> {
    const order = await this.getOrderById(id);

    if (!order) {
      throw error || new RecordNotFoundException();
    }

    return order;
  }

  public async updateOrder(
    id: { orderId: number; resourceId?: OrderResourceId },
    data: Omit<Partial<OrderModel>, "variantSnapshot"> & {
      variantSnapshot?: $OrderAPI.BaseModel["variantSnapshot"];
    },
  ): Promise<OrderModel> {
    return this.db.order.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteOrder(id: {
    orderId: number;
    resourceId?: OrderResourceId;
  }): Promise<{}> {
    await this.db.order.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
      select: { id: true },
    });

    return {};
  }

  private getWhereObjectForFirstLevelOperation(id: {
    variantId: number;
    resourceId?: Omit<OrderResourceId, "variantId">;
  }):
    | {
        variantId: number;
      }
    | { variant: { id: number; productId: number } } {
    if (id.resourceId) {
      return {
        variant: {
          id: id.variantId,
          productId: id.resourceId.productId,
        },
      };
    }

    return {
      variantId: id.variantId,
    };
  }

  private getWhereObjectForSecondLevelOperation(id: {
    orderId: number;
    resourceId?: OrderResourceId;
  }):
    | {
        id: number;
      }
    | { id: number; variant: { id: number; productId: number } } {
    if (id.resourceId) {
      return {
        id: id.orderId,
        variant: {
          id: id.resourceId.variantId,
          productId: id.resourceId.productId,
        },
      };
    }

    return {
      id: id.orderId,
    };
  }
}
