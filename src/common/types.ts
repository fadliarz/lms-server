import { Request, Router } from "express";
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
