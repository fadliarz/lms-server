import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import ClientException from "../../../common/exceptions/ClientException";
import BaseCourseLessonVideoAuthorization from "../../../common/class/BaseCourseLessonVideoAuthorization";
import isNaNArray from "../../../common/functions/isNaNArray";

export class ICourseLessonAuthorizationMiddleware {
  getCreateLessonAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateLessonAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getDeleteLessonAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export class CourseLessonAuthorizationMiddleware
  extends BaseCourseLessonVideoAuthorization
  implements ICourseLessonAuthorizationMiddleware
{
  public getCreateLessonAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
          throw new ClientException();
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

          if (!isAuthorized) {
            const enrollmentRole = await this.getEnrollmentRoleById(
              userId,
              courseId
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

  public getUpdateLessonAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.lessonId);
        if (isNaNArray([courseId, lessonId])) {
          throw new ClientException();
        }

        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          await this.getLessonByIdOrThrow(courseId, lessonId);
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = userId === authorId;
          if (isAuthor || isAdmin) {
            isAuthorized = true;
          }

          if (!isAuthorized) {
            const enrollmentRole = await this.getEnrollmentRoleById(
              userId,
              courseId
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

  public getDeleteLessonAuthorizationMiddleware() {
    return this.getUpdateLessonAuthorizationMiddleware();
  }
}
