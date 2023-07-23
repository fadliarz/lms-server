import { StatusCode } from "../../../common/constants/statusCode";
import { NextFunction, Request, Response } from "express";
import { IUserService } from "../service/user.service";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../user.type";
import { AuthenticatedRequest } from "../../../common/types";
import HttpException from "../../../common/exceptions/HttpException";
import { handleError } from "../../../common/exceptions/handleError";

export interface IUserController {
  signIn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  signUp: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  logOut: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class UserController implements IUserController {
  @inject(UserDITypes.USER_SERVICE) private userService: IUserService;

  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser =
        await this.userService.createNewUserAndGenerateAuthenticationToken(
          req.body
        );

      return res
        .cookie("access_token", newUser.accessToken, {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
          secure: process.env.NODE_ENV === "production",
        })
        .cookie("refresh_token", newUser.refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(StatusCode.RESOURCE_CREATED)
        .json(newUser);
    } catch (error) {
      handleError(error, next);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.signInUser(email, password);

      return res
        .cookie("access_token", user.accessToken, {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
          secure: process.env.NODE_ENV === "production",
        })
        .cookie("refresh_token", user.refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(StatusCode.SUCCESS)
        .json(user);
    } catch (error) {
      handleError(error, next);
    }
  }

  public async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedRequest = req as AuthenticatedRequest;

      if (!authenticatedRequest.user) {
        next(
          new HttpException(StatusCode.BAD_REQUEST, "User is unauthenticated")
        );
      }

      await this.userService.clearUserAuthenticationToken(
        authenticatedRequest.user?.id as string
      );

      return res
        .clearCookie("access_token")
        .status(StatusCode.SUCCESS)
        .json({});
    } catch (error) {
      handleError(error, next)
    }
  }
}
