import { StatusCode } from "../../../common/constants/statusCode";
import { NextFunction, Request, Response } from "express";
import { IUserService } from "../service/user.service";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../user.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import getValuable from "../../../common/functions/getValuable";
import validateJoi from "../../../common/functions/validateJoi";
import { CreateUserDtoJoi, SignIn } from "./user.joi";
import { Cookie } from "../../../common/constants/Cookie";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";

export interface IUserController {
  createUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getPublicUserById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getMe: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateBasicUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  signIn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  signOut: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

@injectable()
export class UserController implements IUserController {
  @inject(UserDITypes.SERVICE) private service: IUserService;

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateUserDtoJoi })(req, res, next);

      const newUser = await this.service.createUser(req.body);

      return res
        .cookie(Cookie.ACCESS_TOKEN, newUser.accessToken, {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
          secure: process.env.NODE_ENV === "production",
        })
        .cookie(Cookie.REFRESH_TOKEN, newUser.refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(StatusCode.RESOURCE_CREATED)
        .json({ data: getValuable({ ...newUser, password: null }) });
    } catch (error) {
      next(error);
    }
  }

  public async getPublicUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new NaNException("userId");
      }

      const publicUser = await this.service.getPublicUserById(userId);

      return res.status(StatusCode.SUCCESS).json({ data: publicUser });
    } catch (error) {
      next(error);
    }
  }

  public async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const me = await this.service.getMe(user.id);

      return res.status(StatusCode.SUCCESS).json({ data: me });
    } catch (error) {
      next(error);
    }
  }

  public async updateBasicUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const userId = this.validateUserId(req);
      const updatedUser = await this.service.updateUser(userId, req.body);

      return res.status(StatusCode.SUCCESS).json({ data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = this.validateUserId(req);
      await this.service.deleteUser(userId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      await validateJoi({ body: SignIn })(req, res, next);

      const { email, password } = req.body;
      const user = await this.service.signInUser(req, res, { email, password });

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  public async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      return res
        .clearCookie(Cookie.ACCESS_TOKEN)
        .status(StatusCode.SUCCESS)
        .json({ data: {} });
    } catch (error) {
      if (error instanceof AuthenticationException) {
        res.clearCookie(Cookie.REFRESH_TOKEN, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      next(error);
    }
  }

  private validateUserId(req: Request, error?: Error): number {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw error || new NaNException("userId");
    }

    return userId;
  }
}
