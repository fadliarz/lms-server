import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { ProductVariantModel, ProductVariantResourceId } from "./variant.type";
import { $ProductVariantAPI } from "./variant.api";
import { ProductModel } from "../product/product.type";

export interface IProductVariantAuthorization {
  authorizeCreateVariant: (user: UserModel) => Promise<void>;
  authorizeUpdateVariant: (user: UserModel) => Promise<void>;
  authorizeDeleteVariant: (user: UserModel) => Promise<void>;
}

export interface IProductVariantController {
  createVariant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getVariants: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getVariantById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateVariant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateVariantStockWithIncrement: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteVariant: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IProductVariantService {
  createVariant: (
    user: UserModel,
    id: {
      resourceId: ProductVariantResourceId;
    },
    dto: $ProductVariantAPI.CreateVariant.Dto,
  ) => Promise<$ProductVariantAPI.CreateVariant.Response["data"]>;
  getVariants: (id: {
    resourceId: ProductVariantResourceId;
  }) => Promise<$ProductVariantAPI.GetVariants.Response["data"]>;
  getVariantById: (id: {
    variantId: number;
    resourceId: ProductVariantResourceId;
  }) => Promise<$ProductVariantAPI.GetVariantById.Response["data"]>;
  updateVariant: (
    user: UserModel,
    id: {
      variantId: number;
      resourceId: ProductVariantResourceId;
    },
    dto: $ProductVariantAPI.UpdateVariant.Dto,
  ) => Promise<$ProductVariantAPI.UpdateVariant.Response["data"]>;
  updateVariantStockWithIncrement: (
    user: UserModel,
    id: {
      variantId: number;
      resourceId: ProductVariantResourceId;
    },
    dto: $ProductVariantAPI.UpdateVariantStockWithIncrement.Dto,
  ) => Promise<
    $ProductVariantAPI.UpdateVariantStockWithIncrement.Response["data"]
  >;
  deleteVariant: (
    user: UserModel,
    id: {
      variantId: number;
      resourceId: ProductVariantResourceId;
    },
  ) => Promise<$ProductVariantAPI.DeleteVariant.Response["data"]>;
}

export interface IProductVariantRepository {
  createVariant: (
    id: { productId: number },
    data: {
      productSnapshot: ProductModel;
    } & $ProductVariantAPI.CreateVariant.Dto,
  ) => Promise<ProductVariantModel>;
  getVariants: (id: { productId: number }) => Promise<ProductVariantModel[]>;
  getVariantById: (id: {
    variantId: number;
    resourceId?: ProductVariantResourceId;
  }) => Promise<ProductVariantModel | null>;
  getVariantByIdOrThrow: (
    id: {
      variantId: number;
      resourceId?: ProductVariantResourceId;
    },
    error?: Error,
  ) => Promise<ProductVariantModel>;
  updateVariant: (
    id: {
      variantId: number;
      resourceId?: ProductVariantResourceId;
    },
    data: Partial<Omit<ProductVariantModel, "productSnapshot">> & {
      productSnapshot?: ProductModel;
    },
  ) => Promise<ProductVariantModel>;
  updateVariantStockWithIncrement: (
    id: {
      variantId: number;
      resourceId?: ProductVariantResourceId;
    },
    data: $ProductVariantAPI.UpdateVariantStockWithIncrement.Dto,
  ) => Promise<ProductVariantModel>;
  deleteVariant: (id: {
    variantId: number;
    resourceId?: ProductVariantResourceId;
  }) => Promise<{}>;
}
