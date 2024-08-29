import { ProductVariantModel } from "./variant.type";

export namespace $ProductVariantAPI {
  const root = "/products/:productId/variants";
  const variant = root + "/:variantId";

  export namespace CreateVariant {
    export const endpoint = root;
    export const generateUrl = (productId: number) =>
      `/products/${productId}/variants`;
    export type Dto = {
      title: string;
      price: number;
    };
    export type Response = {
      data: ProductVariantModel;
    };
  }

  export namespace GetVariants {
    export const endpoint = root;
    export const generateUrl = (productId: number) =>
      `/products/${productId}/variants`;
    export type Response = {
      data: ProductVariantModel[];
    };
  }

  export namespace GetVariantById {
    export const endpoint = variant;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}`;
    export type Response = {
      data: ProductVariantModel;
    };
  }

  export namespace UpdateVariant {
    export const endpoint = variant;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}`;
    export type Dto = {
      title?: string;
      price?: number;
    };
    export type Response = {
      data: ProductVariantModel;
    };
  }

  export namespace DeleteVariant {
    export const endpoint = variant;
    export const generateUrl = (productId: number, variantId: number) =>
      `/products/${productId}/variants/${variantId}`;
    export type Response = {
      data: {};
    };
  }
}
