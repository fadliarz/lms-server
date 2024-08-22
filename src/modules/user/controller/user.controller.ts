import { StatusCode } from "../../../common/constants/statusCode";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { $UserAPI, UserDITypes } from "../user.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateUserDtoJoi,
  SignIn,
  UpdateBasicUserDtoJoi,
  UpdateUserEmailDtoJoi,
  UpdateUserPasswordDtoJoi,
  UpdateUserPhoneNumberDtoJoi,
  UpdateUserRoleDtoJoi,
} from "./user.joi";
import { Cookie } from "../../../common/constants/Cookie";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import { IUserController, IUserService } from "../user.interface";

@injectable()
export default class UserController implements IUserController {
  @inject(UserDITypes.SERVICE) private service: IUserService;

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateUserDtoJoi })(req, res, next);

      const {
        user: newUser,
        token: { accessToken, refreshToken },
      } = await this.service.createUser(req.body);

      return res
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
        })
        .status(StatusCode.RESOURCE_CREATED)
        .json({ data: newUser });
    } catch (error) {
      next(error);
    }
  }

  public async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const user = await this.service.getUserById({
        userId: this.validateUserId(req),
      });

      return res.status(StatusCode.SUCCESS).json({ data: user });
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
      const me = await this.service.getMe(
        getRequestUserOrThrowAuthenticationException(req),
      );

      return res.status(StatusCode.SUCCESS).json({ data: me });
    } catch (error) {
      next(error);
    }
  }

  public async getUserPermissions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const permissions = await this.service.getUserPermissions(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserAssignments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const assignments = await this.service.getUserAssignments(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: assignments,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserEnrolledAsStudentCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const courses = await this.service.getUserEnrolledAsStudentCourses(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserManagedCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const courses = await this.service.getUserManagedCourses(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: courses,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserEventAndCourseSchedules(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const upcoming = await this.service.getUserEventAndCourseSchedules(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: upcoming,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserEnrolledDepartmentPrograms(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const programs = await this.service.getUserEnrolledDepartmentPrograms(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: programs,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserManagedDepartments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const departments = await this.service.getUserManagedDepartments(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: departments,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserManagedDepartmentDivisions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const divisions = await this.service.getUserManagedDepartmentDivisions(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: divisions,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUserReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const report = await this.service.getUserReport(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: report,
      });
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
      await validateJoi({ body: UpdateBasicUserDtoJoi })(req, res, next);

      const updatedUser = await this.service.updateBasicUser(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUserEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const storedRefreshToken = req.cookies[Cookie.REFRESH_TOKEN] as
        | string
        | undefined;
      if (!storedRefreshToken) {
        throw new AuthenticationException();
      }

      await validateJoi({ body: UpdateUserEmailDtoJoi })(req, res, next);

      const updatedUser = await this.service.updateUserEmail(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
        {
          dto: req.body,
          storedRefreshToken,
        },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUserPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const storedRefreshToken = req.cookies[Cookie.REFRESH_TOKEN] as
        | string
        | undefined;
      if (!storedRefreshToken) {
        throw new AuthenticationException();
      }

      await validateJoi({ body: UpdateUserPasswordDtoJoi })(req, res, next);

      const updatedUser = await this.service.updateUserPassword(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
        {
          dto: req.body,
          storedRefreshToken,
        },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUserRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateUserRoleDtoJoi })(req, res, next);

      const updatedUser = await this.service.updateUserRole(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUserPhoneNumber(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateUserPhoneNumberDtoJoi })(req, res, next);

      const updatedUser = await this.service.updateUserPhoneNumber(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.service.deleteUser(
        getRequestUserOrThrowAuthenticationException(req),
        { userId: this.validateUserId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      await validateJoi({ body: SignIn })(req, res, next);

      const { email, password } = req.body;
      await this.service.signInUser(req, res, { email, password });

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  public async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = req.cookies;
      const storedRefreshToken = cookies[Cookie.REFRESH_TOKEN] as
        | undefined
        | string;
      if (!storedRefreshToken) {
        throw new AuthenticationException();
      }

      await this.service.signOutUser(storedRefreshToken);

      return res
        .clearCookie(Cookie.ACCESS_TOKEN)
        .clearCookie(Cookie.REFRESH_TOKEN, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .status(StatusCode.SUCCESS)
        .json({ data: {} } satisfies $UserAPI.SignOut.Response);
    } catch (error) {
      if (error instanceof AuthenticationException) {
        res.clearCookie(Cookie.ACCESS_TOKEN).clearCookie(Cookie.REFRESH_TOKEN, {
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
