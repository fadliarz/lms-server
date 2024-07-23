import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../modules/user/user.type";
import { PrismaClient } from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";

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

// export type PrismaTransaction = Omit<
//   PrismaClient,
//   "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
// >;

export type PrismaTransaction = Omit<PrismaClient, runtime.ITXClientDenyList>;

export interface IControllerTemplate {
  create: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getMany: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  update: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  delete: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IServiceTemplate<Model, ResourceId, CreateDto, UpdateDto> {
  create: (resourceId: ResourceId, dto: CreateDto) => Promise<Model>;
  getById: (id: number, resourceId: ResourceId) => Promise<Model>;
  getMany: (resourceId: ResourceId) => Promise<Model[]>;
  update: (
    id: number,
    resourceId: ResourceId,
    dto: UpdateDto,
  ) => Promise<Model>;
  delete: (id: number, resourceId: ResourceId) => Promise<{}>;
}

export interface IRepositoryTemplate<Model, CreateDto, ResourceId> {
  create: (resourceId: ResourceId, dto: CreateDto) => Promise<Model>;
  getById: (id: number, resourceId: ResourceId) => Promise<Model | null>;
  getByIdOrThrow: (
    id: number,
    resourceId: ResourceId,
    error?: Error,
  ) => Promise<Model>;
  getMany: (resourceId: ResourceId) => Promise<Model[]>;
  update: (
    id: number,
    resourceId: ResourceId,
    dto: Partial<Model>,
  ) => Promise<Model>;
  delete: (id: number, resourceId: ResourceId) => Promise<{}>;
}
