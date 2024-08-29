export const OrderDITypes = {
  REPOSITORY: Symbol.for("ORDER_REPOSITORY"),
  SERVICE: Symbol.for("ORDER_SERVICE"),
  CONTROLLER: Symbol.for("ORDER_CONTROLLER"),
  AUTHORIZATION: Symbol.for("ORDER_AUTHORIZATION"),
} as const;

export type OrderModel = {
  id: number;
  description: string | null;
  receipt: string | null;
  rating: number | null;
  isArrived: boolean;
  arrivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number | null;
  variantId: number;
};

export type OrderResourceId = {
  productId: number;
  variantId: number;
};

export const OrderErrorMessage = {
  OUT_OF_STOCK: "out of stock!",
} as const;
