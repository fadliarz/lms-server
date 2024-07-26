import { NextFunction, Response } from "express";
import { Cookie } from "../common/constants/Cookie";
import AuthenticationException from "../common/class/exceptions/AuthenticationException";
import jwt from "jsonwebtoken";
import ForbiddenException from "../common/class/exceptions/ForbiddenException";
import getValuable from "../common/functions/getValuable";
import dIContainer from "../inversifyConfig";
import { IUserService } from "../modules/user/service/user.service";
import { UserDITypes } from "../modules/user/user.type";
import { IUserRepository } from "../modules/user/repository/user.repository";

export default async (req: any, res: Response, next: NextFunction) => {
  const userService = dIContainer.get<IUserService>(UserDITypes.SERVICE);
  const userRepository = dIContainer.get<IUserRepository>(
    UserDITypes.REPOSITORY,
  );

  try {
    const storedRefreshToken: string | undefined =
      req.cookies[Cookie.REFRESH_TOKEN];
    if (!storedRefreshToken) {
      throw new AuthenticationException();
    }

    let decoded: { email: string };
    const user = await userRepository.getUserByRefreshToken(storedRefreshToken);

    if (!user) {
      /**
       * Reuse detection, invalidate the refresh tokens!
       *
       */

      try {
        decoded = jwt.verify(
          storedRefreshToken,
          process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
        ) as {
          email: string;
        };

        const userRelatedToEmail = await userRepository.getUserByEmail(
          decoded.email,
        );
        if (userRelatedToEmail) {
          await userRepository.updateUser(userRelatedToEmail.id, {
            refreshToken: [],
          });
        }

        throw new Error();
      } catch (error) {
        throw new ForbiddenException();
      }
    }

    let newRefreshTokenArray = user.refreshToken.filter(
      (rt) => rt !== storedRefreshToken,
    );

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
      const accessToken = userService.generateFreshAuthenticationToken(
        Cookie.ACCESS_TOKEN,
        decoded.email,
      );
      const refreshToken = userService.generateFreshAuthenticationToken(
        Cookie.REFRESH_TOKEN,
        decoded.email,
      );

      newRefreshTokenArray = [...newRefreshTokenArray, refreshToken];
      await userRepository.updateUser(user.id, {
        accessToken,
        refreshToken: newRefreshTokenArray,
      });

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
      await userRepository.updateUser(user.id, {
        refreshToken: newRefreshTokenArray,
      });

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
