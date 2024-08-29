import { JsonValue } from "@prisma/client/runtime/library";

export const ProductVariantDITypes = {
  REPOSITORY: Symbol.for("PRODUCT_VARIANT_REPOSITORY"),
  SERVICE: Symbol.for("PRODUCT_VARIANT_SERVICE"),
  CONTROLLER: Symbol.for("PRODUCT_VARIANT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("PRODUCT_VARIANT_AUTHORIZATION"),
} as const;

export type ProductVariantModel = {
  id: number;
  title: string;
  price: number;
  stock: number | null;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
  productId: number | null;
  productSnapshot: JsonValue;
};

export type ProductVariantResourceId = {
  productId: number;
};
