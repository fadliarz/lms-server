import "reflect-metadata";
import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IUserController } from "../controller/user.controller";
import { UserDITypes } from "../user.type";
import { userUrls } from "../user.type";

export default function UserRouter(authenticationMiddleware: any) {
  const router = express.Router();
  const controller = dIContainer.get<IUserController>(UserDITypes.CONTROLLER);

  /**
   * SignIn
   *
   */
  router.post(userUrls.signIn, controller.signIn.bind(controller));

  /**
   * SignOut
   *
   */
  router.post(
    userUrls.signOut,
    authenticationMiddleware,
    controller.signOut.bind(controller),
  );

  /**
   * Create
   *
   */
  router.post("/", controller.createUser.bind(controller));

  /**
   * Get
   *
   */
  router.get(
    userUrls.me,
    authenticationMiddleware,
    controller.getMe.bind(controller),
  );

  router.get(userUrls.public, controller.getPublicUserById.bind(controller));

  /**
   * Update
   *
   */
  router.get(
    userUrls.basic,
    authenticationMiddleware,
    controller.updateBasicUser.bind(controller),
  );

  router.get(
    userUrls.email,
    authenticationMiddleware,
    controller.updateUserEmail.bind(controller),
  );

  router.get(
    userUrls.password,
    authenticationMiddleware,
    controller.updateUserPassword.bind(controller),
  );

  router.get(
    userUrls.phoneNumber,
    authenticationMiddleware,
    controller.updateUserPhoneNumber.bind(controller),
  );

  return router;
}
