import "reflect-metadata"

import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IUserController } from "../controller/user.controller";
import { UserDITypes } from "../user.type";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { SignIn, SignUp } from "../controller/user.joi";
import { userUrls } from "../user.type";

export default function UserRouter(authenticationMiddleware: any) {
  const router = express.Router();
  const controller = dIContainer.get<IUserController>(UserDITypes.CONTROLLER);

  /**
   * Create
   */
  router.post(
    userUrls.signUp,
    validationMiddleware({
      body: SignUp,
    }),
    controller.createUser.bind(controller)
  );

  /**
   * Get
   */
  router.get(userUrls.user, controller.getUserById.bind(controller));

  router.get(
    userUrls.user.concat("/:email"),
    controller.getUserByEmail.bind(controller)
  );
  
  router.get(
    userUrls.user,
    authenticationMiddleware,
    controller.getMe.bind(controller)
  );

  /**
   * Update
   */
  router.post(
    userUrls.signIn,
    validationMiddleware({ body: SignIn }),
    controller.signIn.bind(controller)
  );

  router.put(
    userUrls.logOut,
    authenticationMiddleware,
    controller.logOut.bind(controller)
  );

  return router;
}
