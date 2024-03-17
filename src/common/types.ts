import { Request, Router } from "express";
import { UserModel } from "../modules/user/user.type";
import { PrismaClient } from "@prisma/client";

export interface GenericObject<K> {
  [key: string]: K;
}

export interface AuthenticatedRequest extends Request {
  user: UserModel;
}

export type MakePropertiesOptional<T extends object, K extends keyof T> = Omit<
  T,
  K
> &
  Partial<Pick<T, K>>;

export type Valuable<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};

export type Api = {
  router: Router;
  path: string;
  middleware?: any[];
};

export type UnauthenticatedResourceId<T extends {}> = Omit<T, "user">;

/**
 * Modifying Prisma Model
 *
 */
export type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

export type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

export type ModifyFieldWithNullToBeOptionalAndRemoveNull<T> = {
  [K in keyof PickNullable<T>]?: Exclude<T[K], null>;
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

export type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;
