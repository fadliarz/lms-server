import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getValuable from "../common/functions/getValuable";
import AuthenticationException from "../common/class/exceptions/AuthenticationException";
import RecordNotFoundException from "../common/class/exceptions/RecordNotFoundException";
import PrismaClientSingleton from "../common/class/PrismaClientSingleton";
import { Cookie } from "../common/constants/Cookie";

export const getAuthMiddleWare = () => {
  const userTable = PrismaClientSingleton.getInstance().user;

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies[Cookie.ACCESS_TOKEN] || req.headers.cookie;

      let decoded: { email: string };
      try {
        decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
        ) as {
          email: string;
        };
      } catch (error) {
        throw new AuthenticationException();
      }

      const user = await userTable.findFirst({
        where: {
          email: decoded.email,
          accessToken,
        },
      });

      /**
       * Some possible scenarios:
       *
       * 1. User changed the email
       * 2. Deleted user
       *
       */
      if (!user) {
        throw new AuthenticationException();
      }

      user.refreshToken = [];

      req.accessToken = accessToken;
      req.user = getValuable(user);

      next();
    } catch (error) {
      next(error);
    }
  };
};
