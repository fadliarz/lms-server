import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import getValuable from "../common/functions/getValuable";
import AuthenticationException from "../common/exceptions/AuthenticationException";
import RecordNotFoundException from "../common/exceptions/RecordNotFoundException";

export const getAuthMiddleWare = () => {
  const userTable = new PrismaClient().user;

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token || req.headers.cookie;

      let decoded: { email: string };
      try {
        decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY as string
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

      if (!user) {
        throw new RecordNotFoundException("User not found!");
      }

      user.refreshToken = null;

      req.accessToken = accessToken;
      req.user = getValuable(user);

      next();
    } catch (error) {
      next(error);
    }
  };
};
