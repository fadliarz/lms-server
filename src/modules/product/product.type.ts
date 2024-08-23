export namespace $ProductAPI {
  const root = "/products";
  const product = "/:productId";

  export namespace CreateProduct {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Dto = {
      title: string;
      description?: string;
      price: number;
    };
  }

  export namespace UpdateProduct {}
}
export type ProductModel = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  size: string[];
};
