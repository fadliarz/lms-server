import { StatusCode } from "../../../common/constants/statusCode";
import { NextFunction, Request, Response } from "express";
import { IUserService } from "../service/user.service";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../user.type";
import { getResponseJson } from "../../../common/functions/getResponseJson";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

export interface IUserController {
  getMe: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
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
  @inject(UserDITypes.USER_SERVICE) private service: IUserService;

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const me = await this.service.getMe(user.id);

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, me));
    } catch (error) {
      next(error);
    }
  }

  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser =
        await this.service.createNewUserAndGenerateAuthenticationToken(
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
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, newUser));
    } catch (error) {
      next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await this.service.signInUser(email, password);

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
        .json(
          getResponseJson(true, StatusCode.SUCCESS, {
            userId: user.id,
            token: user.accessToken,
            type: "USER",
            expires_at: "30d",
          })
        );
    } catch (error) {
      next(error);
    }
  }

  public async logOut(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      
      await this.service.clearUserAuthenticationToken(user.id);

      return res
        .clearCookie("access_token")
        .status(StatusCode.SUCCESS)
        .json(user);
    } catch (error) {
      next(error);
    }
  }
}
