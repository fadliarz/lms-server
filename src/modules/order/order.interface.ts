import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { OrderModel, OrderResourceId } from "./order.type";
import { $OrderAPI } from "./order.api";

export interface IOrderAuthorization {
  authorizeCreateOrder: (user: UserModel, id: { targetUserId: number }) => void;
  authorizeGetOrders: (user: UserModel) => Promise<void>;
  authorizeGetOrderById: (
    user: UserModel,
    order: Pick<OrderModel, "userId">,
  ) => Promise<void>;
  authorizeUpdateOrderArrivedStatus: (user: UserModel) => Promise<void>;
  authorizeUpdateOrderReceipt: (
    user: UserModel,
    order: OrderModel | null,
  ) => Promise<void>;
  authorizeUpdateOrderRating: (
    user: UserModel,
    order: OrderModel | null,
  ) => Promise<void>;
  authorizeDeleteOrder: (
    user: UserModel,
    order: OrderModel | null,
  ) => Promise<void>;
}

export interface IOrderController {
  createOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getOrders: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getOrderById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateOrderArrivedStatus: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateOrderReceipt: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateOrderRating: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteOrder: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IOrderService {
  createOrder: (
    user: UserModel,
    id: {
      variantId: number;
      resourceId: Omit<OrderResourceId, "variantId">;
    },
    dto: $OrderAPI.CreateOrder.Dto,
  ) => Promise<$OrderAPI.CreateOrder.Response["data"]>;
  getOrders: (
    user: UserModel,
    id: {
      variantId: number;
      resourceId: Omit<OrderResourceId, "variantId">;
    },
  ) => Promise<$OrderAPI.GetOrders.Response["data"]>;
  getOrderById: (
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
  ) => Promise<$OrderAPI.GetOrderById.Response["data"]>;
  updateOrderArrivedStatus: (
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
    dto: $OrderAPI.UpdateOrderArrivedStatus.Dto,
  ) => Promise<$OrderAPI.UpdateOrderArrivedStatus.Response["data"]>;
  updateOrderReceipt: (
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
    dto: $OrderAPI.UpdateOrderReceipt.Dto,
  ) => Promise<$OrderAPI.UpdateOrderReceipt.Response["data"]>;
  updateOrderRating: (
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
    dto: $OrderAPI.UpdateOrderRating.Dto,
  ) => Promise<$OrderAPI.UpdateOrderRating.Response["data"]>;
  deleteOrder: (
    user: UserModel,
    id: {
      orderId: number;
      resourceId: OrderResourceId;
    },
  ) => Promise<$OrderAPI.DeleteOrder.Response["data"]>;
}

export interface IOrderRepository {
  createOrder: (
    id: {
      variantId: number;
      resourceId?: Omit<OrderResourceId, "variantId">;
    },
    data: {
      variantSnapshot: $OrderAPI.BaseModel["variantSnapshot"];
    } & $OrderAPI.CreateOrder.Dto,
  ) => Promise<OrderModel>;
  getOrders: (id: {
    variantId: number;
    resourceId?: Omit<OrderResourceId, "variantId">;
  }) => Promise<OrderModel[]>;
  getOrderById: (id: {
    orderId: number;
    resourceId?: OrderResourceId;
  }) => Promise<OrderModel | null>;
  getOrderByIdOrThrow: (
    id: {
      orderId: number;
      resourceId?: OrderResourceId;
    },
    error?: Error,
  ) => Promise<OrderModel>;
  updateOrder: (
    id: { orderId: number; resourceId?: OrderResourceId },
    data: Omit<Partial<OrderModel>, "variantSnapshot"> & {
      variantSnapshot?: $OrderAPI.BaseModel["variantSnapshot"];
    },
  ) => Promise<OrderModel>;
  deleteOrder: (id: {
    orderId: number;
    resourceId?: OrderResourceId;
  }) => Promise<{ id: number }>;
}
