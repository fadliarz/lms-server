import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IUserController } from "../controller/user.controller";
import { UserDITypes } from "../user.type";
import { validationMiddleware } from "../../../middlewares/validationMiddleware";
import { SignIn, SignUp } from "../controller/user.joi";
import { userUrls } from "../user.type";

export default function UserRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IUserController>(
    UserDITypes.USER_CONTROLLER
  );

  router.get(userUrls.me, authenticationMiddleware, controller.getMe.bind(controller));

  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - User
   *     description: Returns a sample response
   *     responses:
   *       200:
   *         description: A sample response
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
   */
  router.post(
    userUrls.signUp,
    validationMiddleware({
      body: SignUp,
    }),
    controller.signUp.bind(controller)
  );

  /**
   * @swagger
   * /users/:userId:
   *   get:
   *     tags:
   *       - User
   *     description: Returns a sample response
   *     responses:
   *       200:
   *         description: A sample response
   *         schema:
   *           type: object
   *           properties:
   *             message:
   *               type: string
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
