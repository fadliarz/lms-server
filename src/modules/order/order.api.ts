import { OrderModel } from "./order.type";
import { ProductVariantModel } from "../product-variant/variant.type";
import { ProductModel } from "../product/product.type";

export namespace $OrderAPI {
  const root = "/products/:productId/variants/:variantId/orders";
  const order = root + "/:orderId";
  export type BaseModel = Omit<OrderModel, "variantSnapshot"> & {
    variantSnapshot: Pick<
      ProductVariantModel,
      "id" | "title" | "price" | "stock"
    > & {
      product: Pick<ProductModel, "id" | "title" | "description">;
    };
  };

  export function transformObject(order: OrderModel): BaseModel;
  export function transformObject(order: OrderModel[]): BaseModel[];
  export function transformObject(
    order: OrderModel | OrderModel[],
  ): BaseModel | BaseModel[] {
    if (Array.isArray(order)) {
      return order as BaseModel[];
    }

    return order as BaseModel;
  }

  export namespace CreateOrder {
    export const endpoint = root;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}/orders`;
    export type Dto = {
      userId: number;
      description?: string;
    };
    export type Response = {
      data: BaseModel;
    };
  }

  export namespace GetOrders {
    export const endpoint = root;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}/orders`;
    export type Response = {
      data: BaseModel[];
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
      data: BaseModel;
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
      data: BaseModel;
    };
  }

  export namespace UpdateOrderReceipt {
    const attribute = "receipt";
    export const endpoint = `${order}/${attribute}`;
    export const generateUrl = (
      productId: number,
      variantId: number,
      orderId: number,
    ) =>
      `/products/${productId}/variants/${variantId}/orders/${orderId}/${attribute}`;
    export type Dto = {
      receipt: string | null;
    };
    export type Response = {
      data: BaseModel;
    };
  }

  export namespace UpdateOrderRating {
    const attribute = "rating";
    export const endpoint = `${order}/${attribute}`;
    export const generateUrl = (
      productId: number,
      variantId: number,
      orderId: number,
    ) =>
      `/products/${productId}/variants/${variantId}/orders/${orderId}/${attribute}`;
    export type Dto = {
      rating: 1 | 2 | 3 | 4 | 5 | null;
    };
    export type Response = {
      data: BaseModel;
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
      data: { id: number };
    };
  }
}
