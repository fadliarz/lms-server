import { NextFunction, Request, Response, Router } from "express";
import { UserModel } from "../modules/user/user.type";
import { PrismaClient } from "@prisma/client";
import * as runtime from "@prisma/client/runtime/library";

export type Api = {
  router: Router;
  path: string;
  middleware?: any[];
};

export type UnauthenticatedResourceId<T extends {}> = Omit<T, "user">;

export interface AuthenticatedRequest extends Request {
  user: UserModel;
}

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
