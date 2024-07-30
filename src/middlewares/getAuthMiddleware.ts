import "reflect-metadata";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AuthenticationException from "../common/class/exceptions/AuthenticationException";
import { Cookie } from "../common/constants/Cookie";
import dIContainer from "../inversifyConfig";
import { UserDITypes } from "../modules/user/user.type";
import getValuable from "../common/functions/getValuable";
import refreshToken from "./refreshToken";
import { IUserRepository } from "../modules/user/user.interface";

export const getAuthMiddleWare = () => {
  const userRepository = dIContainer.get<IUserRepository>(
    UserDITypes.REPOSITORY,
  );

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const accessToken: string | undefined = req.cookies[Cookie.ACCESS_TOKEN];
      if (!accessToken) {
        throw new AuthenticationException();
      }

      let decoded: { email: string };

      decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      ) as {
        email: string;
      };

      const user = await userRepository.getUserByAccessToken(accessToken);
      if (!user) {
        throw new Error();
      }

      if (user.email == decoded.email) {
        user.password = null as unknown as string;
        user.refreshToken = null as unknown as string[];
        user.accessToken = null;
        req.user = getValuable(user);

        next();
      }
    } catch (error) {
      if (error instanceof AuthenticationException) {
        next(error);
      } else {
        /**
         * Expired access token!
         *
         */
        refreshToken(req, res, next);
      }
    }
  };
};
