import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.type";
import { $ProductAPI } from "./product.api";
import { ProductModel } from "./product.type";

export interface IProductAuthorization {
  authorizeCreateProduct: (user: UserModel) => Promise<void>;
  authorizeUpdateProduct: (user: UserModel) => Promise<void>;
  authorizeDeleteProduct: (user: UserModel) => Promise<void>;
}

export interface IProductController {
  createProduct: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getProducts: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getProductById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateProduct: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteProduct: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IProductService {
  createProduct: (
    user: UserModel,
    dto: $ProductAPI.CreateProduct.Dto,
  ) => Promise<$ProductAPI.CreateProduct.Response["data"]>;
  getProducts: () => Promise<$ProductAPI.GetProducts.Response["data"]>;
  getProductById: (id: {
    productId: number;
  }) => Promise<$ProductAPI.GetProductById.Response["data"]>;
  updateProduct: (
    user: UserModel,
    id: {
      productId: number;
    },
    dto: $ProductAPI.UpdateProduct.Dto,
  ) => Promise<$ProductAPI.UpdateProduct.Response["data"]>;
  deleteProduct: (
    user: UserModel,
    id: {
      productId: number;
    },
  ) => Promise<$ProductAPI.DeleteProduct.Response["data"]>;
}

export interface IProductRepository {
  createProduct: (data: $ProductAPI.CreateProduct.Dto) => Promise<ProductModel>;
  getProducts: () => Promise<ProductModel[]>;
  getProductById: (id: {
    productId: number;
  }) => Promise<$ProductAPI.GetProductById.Response["data"] | null>;
  getProductByIdOrThrow: (
    id: {
      productId: number;
    },
    error?: Error,
  ) => Promise<$ProductAPI.GetProductById.Response["data"]>;
  updateProduct: (
    id: { productId: number },
    data: Partial<ProductModel>,
  ) => Promise<ProductModel>;
  deleteProduct: (id: { productId: number }) => Promise<{ id: number }>;
}
