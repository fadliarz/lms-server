import { Request, Router } from "express";
import { UserModel } from "../modules/user/user.type";

export interface GenericObject<K> {
  [key: string]: K;
}

export interface AuthenticatedRequest extends Request {
  user: UserModel | null | undefined
}

export type Valuable<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};

export type Api = {
  router: Router;
  path: string;
};

/**
 * Modifying Prisma Model
 */
export type ChangeNullToUndefined<T> = T extends null ? undefined : T;

export type ModifyFieldWithNullToBeOptionalAndRemoveNull<T extends object> = {
  [K in keyof T]: ChangeNullToUndefined<T[K]>;
};
