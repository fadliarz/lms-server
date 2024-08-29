import { OrderModel } from "./order.type";

export namespace $OrderAPI {
  const root = "/products/:productId/variants/:variantId/orders";
  const order = root + "/:orderId";

  export namespace CreateOrder {
    export const endpoint = root;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}/orders`;
    export type Dto = {
      userId: number;
      description?: string;
    };
    export type Response = {
      data: OrderModel;
    };
  }

  export namespace GetOrders {
    export const endpoint = root;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}/orders`;
    export type Response = {
      data: OrderModel[];
    };
  }

  export namespace GetOrderById {
    export const endpoint = order;
    export const generateUrl = (
      productId: number,
      variantId: number,
      orderId: number,
    ) => `/products/${productId}/variants/${variantId}/orders/${orderId}}`;
    export type Response = {
      data: OrderModel;
    };
  }

  export namespace UpdateOrderArrivedStatus {
    const attribute = "arrived-status";
    export const endpoint = `${order}/${attribute}`;
    export const generateUrl = (
      productId: number,
      variantId: number,
      orderId: number,
    ) =>
      `/products/${productId}/variants/${variantId}/orders/${orderId}/${attribute}`;
    export type Dto = {
      isArrived: boolean;
    };
    export type Response = {
      data: OrderModel;
    };
  }

  export namespace DeleteOrder {
    export const endpoint = order;
    export const generateUrl = (
      productId: number,
      variantId: number,
      orderId: number,
    ) => `/products/${productId}/variants/${variantId}/orders/${orderId}}`;
    export type Response = {
      data: {};
    };
  }
}
