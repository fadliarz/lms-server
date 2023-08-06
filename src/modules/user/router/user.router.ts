import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IUserController } from "../controller/user.controller";
import { UserDITypes } from "../user.type";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { SignIn, SignUp } from "../controller/user.joi";
import { userUrls } from "../user.type";

export default function UserRouter(authMiddleware: any) {
  const router = express.Router();

  const userControllerInstance = dIContainer.get<IUserController>(
    UserDITypes.USER_CONTROLLER
  );

  router.post(
    userUrls.signUp,
    validationMiddleware(SignIn, "body"),
    userControllerInstance.signUp.bind(userControllerInstance)
  );

  router.post(
    userUrls.signIn,
    validationMiddleware(SignUp, "body"),
    userControllerInstance.signIn.bind(userControllerInstance)
  );

  router.put(
    userUrls.logOut,
    authMiddleware,
    userControllerInstance.logOut.bind(userControllerInstance)
  );

  return router;
}
