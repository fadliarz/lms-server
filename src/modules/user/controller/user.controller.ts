import { StatusCode } from "../../../common/constants/statusCode";
import { NextFunction, Request, Response } from "express";
import { IUserService } from "../service/user.service";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../user.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import filterPublicData from "../../../common/functions/filterPublicData";
import getValuable from "../../../common/functions/getValuable";

export interface IUserController {
  createUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getUserById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getUserByEmail: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getMe: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  deleteUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  signIn: (
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
  @inject(UserDITypes.SERVICE) private service: IUserService;

  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const newUser = await this.service.createUser(req.body);

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
        .json({ data: getValuable(newUser) });
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const userData = await this.service.getUserById(user.id);

      return res.status(StatusCode.SUCCESS).json({ data: userData });
    } catch (error) {
      next(error);
    }
  }

  public async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = await this.service.getUserByEmail(req.params.email);

      return res.status(StatusCode.SUCCESS).json({ data: userData });
    } catch (error) {
      next(error);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const me = await this.service.getMe(user.id);

      return res.status(StatusCode.SUCCESS).json({ data: me });
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const userId = Number(req.params.userId) as number;
      const updatedUser = await this.service.updateUser(userId, payload);

      return res.status(StatusCode.SUCCESS).json({ data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId) as number;
      await this.service.deleteUser(userId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await this.service.signInUser(email, password);
      const expiresIn = 30; // days

      return res
        .cookie("access_token", user.accessToken, {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * 24 * expiresIn,
          secure: process.env.NODE_ENV === "production",
        })
        .cookie("refresh_token", user.refreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * expiresIn,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(StatusCode.SUCCESS)
        .json({
          data: { expiresAtt: expiresIn.toString, ...filterPublicData(user) },
        });
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
        .json({ data: {} });
    } catch (error) {
      next(error);
    }
  }
}
