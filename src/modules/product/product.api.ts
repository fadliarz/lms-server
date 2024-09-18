import { ProductModel } from "./product.type";
import { ProductVariantModel } from "../product-variant/variant.type";

export namespace $ProductAPI {
  const root = "/products";
  const product = root + "/:productId";

  export namespace CreateProduct {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Dto = {
      title: string;
      description?: string;
    };
    export type Response = {
      data: ProductModel;
    };
  }

  export namespace GetProducts {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Response = {
      data: ProductModel[];
    };
  }

  export namespace GetProductById {
    export const endpoint = product;
    export const generateUrl = (productId: number) => `/products/${productId}`;
    export type Response = {
      data: ProductModel & { variants: ProductVariantModel[] };
    };
  }

  export namespace UpdateProduct {
    export const endpoint = product;
    export const generateUrl = (productId: number) => `/products/${productId}`;
    export type Dto = {
      title?: string;
      description?: string;
    };
    export type Response = {
      data: ProductModel;
    };
  }

  export namespace DeleteProduct {
    export const endpoint = product;
    export const generateUrl = (productId: number) => `/products/${productId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
