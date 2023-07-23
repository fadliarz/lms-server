import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCode } from "../common/constants/statusCode";
import HttpException from "../common/exceptions/HttpException";
import { PrismaClient } from "@prisma/client";
import { getValuable } from "../common/functions/getValuable";

export const getAuthMiddleWare = () => {
  const userTable = new PrismaClient().user;

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.access_token || req.headers.cookie;
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_PRIVATE_KEY as string
      ) as {
        email: string;
      };

      const user = await userTable.findFirst({
        where: {
          email: decoded.email,
          accessToken,
        },
      });

      if (!user) {
        throw new HttpException(StatusCode.NOT_FOUND, "User not found!");
      }

      user.refreshToken = null;

      req.accessToken = accessToken;
      req.user = getValuable(user);

      next();
    } catch (error) {
      if (!(error instanceof HttpException)) {
        next(
          new HttpException(StatusCode.BAD_REQUEST, "You are not logged in!")
        );
      }

      next(error);
    }
  };
};
