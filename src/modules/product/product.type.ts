export const ProductDITypes = {
  REPOSITORY: Symbol.for("PRODUCT_REPOSITORY"),
  SERVICE: Symbol.for("PRODUCT_SERVICE"),
  CONTROLLER: Symbol.for("PRODUCT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("PRODUCT_AUTHORIZATION"),
} as const;

export type ProductModel = {
  id: number;
  title: string;
  description: string | null;
  rating: number | null;
  totalSales: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
};
