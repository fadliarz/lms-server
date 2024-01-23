import { injectable } from "inversify";
import {
  CourseLessonAuthorizationMiddleware,
  ICourseLessonAuthorizationMiddleware,
} from "../../lesson/authorization/lesson.authorization";
import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { CourseLessonVideoResourceId } from "../video.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { Role } from "@prisma/client";
import HttpException from "../../../common/class/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import ClientException from "../../../common/class/exceptions/ClientException";
import isNaNArray from "../../../common/functions/isNaNArray";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import { ErrorCode } from "../../../common/constants/errorCode";
import { ErrorMessage } from "../../../common/constants/errorMessage";
import NaNException from "../../../common/class/exceptions/NaNException";

export interface ICourseLessonVideoAuthorizationMiddleware
  extends ICourseLessonAuthorizationMiddleware {
  getCreateVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getGetVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUpdateVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDeleteVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

@injectable()
export class CourseLessonVideoAuthorizationMiddleware
  extends CourseLessonAuthorizationMiddleware
  implements ICourseLessonVideoAuthorizationMiddleware
{
  public getCreateVideoAuthorizationMiddleware() {
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
            const enrollment =
              await this.table.courseEnrollment.findUniqueByUserIdAndCourseId(
                userId,
                courseId,
              );
            if (
              enrollment &&
              isEqualOrIncludeRole(enrollment.role, Role.INSTRUCTOR)
            ) {
              isAuthorized = true;
            }
          }
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

  public getGetVideoAuthorizationMiddleware() {
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
        if (isStudent || isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = userId === authorId;
          if (isAuthor) {
            isAuthorized = true;
          }

          if (!isAuthorized) {
            const enrollment =
              await this.table.courseEnrollment.findUniqueByUserIdAndCourseId(
                userId,
                courseId,
              );

            if (enrollment) {
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

  public getUpdateVideoAuthorizationMiddleware() {
    return this.getCreateVideoAuthorizationMiddleware();
  }

  public getDeleteVideoAuthorizationMiddleware() {
    return this.getCreateVideoAuthorizationMiddleware();
  }
}
