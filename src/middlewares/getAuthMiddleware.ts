import "reflect-metadata";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import getValuable from "../common/functions/getValuable";
import AuthenticationException from "../common/class/exceptions/AuthenticationException";
import { Cookie } from "../common/constants/Cookie";
import dIContainer from "../inversifyConfig";
import { IUserRepository } from "../modules/user/repository/user.repository";
import { UserDITypes } from "../modules/user/user.type";
import ForbiddenException from "../common/class/exceptions/ForbiddenException";
import { IUserService } from "../modules/user/service/user.service";

export const getAuthMiddleWare = () => {
  const userService = dIContainer.get<IUserService>(UserDITypes.SERVICE);
  const userRepository = dIContainer.get<IUserRepository>(
    UserDITypes.REPOSITORY,
  );

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const storedRefreshToken: string | undefined =
        req.cookies[Cookie.ACCESS_TOKEN];
      if (!storedRefreshToken) {
        throw new AuthenticationException();
      }

      let decoded: { email: string };
      const user =
        await userRepository.getUserByRefreshToken(storedRefreshToken);

      if (!user) {
        try {
          decoded = jwt.verify(
            storedRefreshToken,
            process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
          ) as {
            email: string;
          };

          const userRelatedToEmail = await userRepository.getUserByEmail(
            decoded.email,
          );
          /**
           * Detected refresh token reuse!
           *
           * Account is hacked, clear refreshToken!.
           *
           */
          if (userRelatedToEmail) {
            await userRepository.unauthorizedUpdateUser(userRelatedToEmail.id, {
              refreshToken: [],
            });
          }

          throw new Error();
        } catch (error) {
          throw new ForbiddenException();
        }
      }

      try {
        decoded = jwt.verify(
          storedRefreshToken,
          process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
        ) as {
          email: string;
        };

        if (decoded.email !== user.email) {
          throw new Error();
        }

        /**
         * At this point, it's proven that the refreshToken is still valid
         *
         */
        const accessToken = await userService.generateFreshAuthenticationToken(
          Cookie.ACCESS_TOKEN,
          decoded.email,
        );
        const refreshToken = await userService.generateFreshAuthenticationToken(
          Cookie.REFRESH_TOKEN,
          decoded.email,
        );

        res
          .cookie(Cookie.ACCESS_TOKEN, accessToken, {
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
            secure: process.env.NODE_ENV === "production",
          })
          .cookie(Cookie.REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
      } catch (error) {
        /**
         * Some possible scenarios:
         *
         * 1. Expired refreshToken
         * 2. User email and decoded email don't match
         *
         */
        throw new ForbiddenException();
      }

      user.password = null as unknown as string;
      user.refreshToken = null as unknown as string[];
      user.accessToken = null;
      req.user = getValuable(user);

      next();
    } catch (error) {
      next(error);
    }
  };
};
