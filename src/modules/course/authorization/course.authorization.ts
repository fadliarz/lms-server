import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/authorization/BaseCourseAuthorization";
import { CourseLikeResourceId } from "../course.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import HttpException from "../../../common/class/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import ClientException from "../../../common/class/exceptions/ClientException";
import isNaNArray from "../../../common/functions/isNaNArray";
import { ErrorCode } from "../../../common/constants/errorCode";
import { ErrorMessage } from "../../../common/constants/errorMessage";
import { injectable } from "inversify";
import NaNException from "../../../common/class/exceptions/NaNException";

export interface ICourseAuthorizationMiddleware {
  getCreateCourseAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUpdateCourseAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDeleteCourseAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getCreateCourseLikeAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDeleteCourseLikeAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

@injectable()
export class CourseAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseAuthorizationMiddleware
{
  public getCreateCourseAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isStudent, isInstructor, isAdmin } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          isAuthorized = true;
        }

        if (!isAuthorized) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getUpdateCourseAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
          throw new NaNException("courseId");
        }

        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = userId === authorId;
          if (isAuthor || isAdmin) {
            isAuthorized = true;
          }

          if (!isAuthorized) {
            const enrollmentRole = await this.getEnrollmentRoleById(
              userId,
              courseId,
            );

            if (
              enrollmentRole &&
              isEqualOrIncludeRole(enrollmentRole, Role.INSTRUCTOR)
            ) {
              isAuthorized = true;
            }
          }
        }

        if (isAdmin) {
          isAuthorized = true;
        }

        if (!isAuthorized) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getDeleteCourseAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
          throw new NaNException("courseId");
        }
        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = userId === authorId;

          if (isAuthor) {
            isAuthorized = true;
          }
        }

        if (isAdmin) {
          isAuthorized = true;
        }

        if (!isAuthorized) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getCreateCourseLikeAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
          throw new NaNException("courseId");
        }

        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent || isInstructor || isAdmin) {
          const enrollmentRole = await this.getEnrollmentRoleById(
            userId,
            courseId,
          );

          if (
            enrollmentRole &&
            isEqualOrIncludeRole(enrollmentRole, Role.STUDENT)
          ) {
            isAuthorized = true;
          }
        }

        if (isAdmin) {
          isAuthorized = true;
        }

        if (!isAuthorized) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getDeleteCourseLikeAuthorization() {
    return this.getCreateCourseAuthorizationMiddleware();
  }
}
