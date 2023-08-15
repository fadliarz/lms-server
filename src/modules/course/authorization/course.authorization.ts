import { Request, Response, NextFunction } from "express";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Role } from "@prisma/client";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";
import { injectable } from "inversify";
import { isEqualOrIncludeRole } from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import { processQuery } from "../../../common/functions/processQuery";
import { GetCourseQuery } from "../course.type";

export interface ICourseAuthorizationMiddleware {
  getDeleteCourseLikeAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getCreateCourseLikeAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getDeleteCourseAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateCourseAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getCourseByIdAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getCreateCourseAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

@injectable()
export class CourseAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseAuthorizationMiddleware
{
  public getDeleteCourseLikeAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);

        const enrollment = await this.prisma.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: Number(req.params.courseId),
            },
          },
          select: {
            role: true,
          },
        });

        if (!enrollment) {
          throw new AuthorizationException();
        }

        if (!isEqualOrIncludeRole(enrollment.role, Role.STUDENT)) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {}
    };
  }

  public getCreateCourseLikeAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);

        const enrollment = await this.prisma.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: Number(req.params.courseId),
            },
          },
          select: {
            role: true,
          },
        });

        if (!enrollment) {
          throw new AuthorizationException();
        }

        if (!isEqualOrIncludeRole(enrollment.role, Role.STUDENT)) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getDeleteCourseAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const authorId = await this.getCourseOwnerUserIdOrThrow(
          Number(req.params.courseId)
        );
        const isAuthor = user.id === authorId;

        if (!isAuthor && !isEqualOrIncludeRole(user.role, Role.OWNER)) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getUpdateCourseAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);

        if (!isEqualOrIncludeRole(user.role, [Role.INSTRUCTOR, Role.OWNER])) {
          throw new AuthorizationException();
        }

        if (isEqualOrIncludeRole(user.role, Role.OWNER)) {
          next();
        }

        const authorId = await this.getCourseOwnerUserIdOrThrow(
          Number(req.params.courseId)
        );
        const isAuthor = user.id === authorId;

        if (isAuthor) {
          next();
        }

        const enrollment = await this.prisma.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: Number(req.params.courseId),
            },
          },
          select: {
            role: true,
          },
        });

        if (!enrollment) {
          throw new AuthorizationException();
        }

        if (!isEqualOrIncludeRole(enrollment.role, [Role.INSTRUCTOR])) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getCourseByIdAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const query = processQuery(req.query as GetCourseQuery);
        const authorId = await this.getCourseOwnerUserIdOrThrow(
          Number(req.params.courseId)
        );
        const isAuthor = user.id === authorId;

        if (query.include_videos) {
          if (isAuthor) {
            next();
          }

          const enrollment = await this.prisma.courseEnrollment.findUnique({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: Number(req.params.courseId),
              },
            },
            select: {
              id: true,
            },
          });

          if (!enrollment) {
            throw new AuthorizationException();
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getCreateCourseAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);

        if (!isEqualOrIncludeRole(user.role, [Role.INSTRUCTOR, Role.OWNER])) {
          throw new AuthorizationException();
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
