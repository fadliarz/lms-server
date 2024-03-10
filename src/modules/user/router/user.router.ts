import "reflect-metadata";

import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IUserController } from "../controller/user.controller";
import { UserDITypes } from "../user.type";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { SignIn } from "../controller/user.joi";
import { userUrls } from "../user.type";

export default function UserRouter(authenticationMiddleware: any) {
  const router = express.Router();
  const controller = dIContainer.get<IUserController>(UserDITypes.CONTROLLER);

  return router;
}
