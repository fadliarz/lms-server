import { Request, Response, NextFunction } from "express";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { isEqualOrIncludeRole } from "../../../common/functions/isEqualOrIncludeRole";
import { Role } from "@prisma/client";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";
import { getRoleStatus } from "../../../common/functions/getRoleStatus";

export class ICourseLessonAuthorizationMiddleware {
  getDeleteLessonAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateLessonAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getCreateLessonAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export class CourseLessonAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseLessonAuthorizationMiddleware
{
  public getDeleteLessonAuthorizationMiddleware() {
    return this.getCreateLessonAuthorizationMiddleware();
  }

  public getUpdateLessonAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const isInstructor = isEqualOrIncludeRole(user.role, Role.INSTRUCTOR);
        const isStudent = isEqualOrIncludeRole(user.role, Role.STUDENT);

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor) {
          const authorId = await this.getCourseOwnerUserIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if (isAuthor) {
            next();
          }

          const enrollment = await this.getCourseEnrollment(
            user.id,
            Number(req.params.courseId)
          );

          if (!enrollment) {
            throw new AuthorizationException();
          }

          if (isEqualOrIncludeRole(enrollment?.role as Role, Role.INSTRUCTOR)) {
            throw new AuthorizationException();
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getCreateLessonAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isInstructor, isStudent } = getRoleStatus(user.role);

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor) {
          const authorId = await this.getCourseOwnerUserIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;
          if (isAuthor) {
            next();
          }

          const enrollment = await this.getCourseEnrollment(
            user.id,
            Number(req.params.courseId),
            { role: true }
          );

          if (!enrollment) {
            throw new AuthorizationException();
          }

          if (
            !isEqualOrIncludeRole(enrollment?.role as Role, Role.INSTRUCTOR)
          ) {
            throw new AuthorizationException();
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
