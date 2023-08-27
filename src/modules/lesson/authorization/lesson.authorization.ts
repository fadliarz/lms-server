import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { injectable } from "inversify";
import { CreateCourseLessonDto } from "../lesson.type";
import ClientException from "../../../common/exceptions/ClientException";
import BaseCourseLessonVideoAuthorization from "../../../common/class/BaseCourseLessonVideoAuthorization";

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

@injectable()
export class CourseLessonAuthorizationMiddleware
  extends BaseCourseLessonVideoAuthorization
  implements ICourseLessonAuthorizationMiddleware
{
  public getDeleteLessonAuthorizationMiddleware() {
    return this.getUpdateLessonAuthorizationMiddleware();
  }

  public getUpdateLessonAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor || isAdmin) {
          const lessonId = Number(req.params.lessonId);

          if (isNaN(lessonId)) {
            throw new ClientException("Invalid lessonId!");
          }
          const courseId = await this.getCourseIdByLessonIdOrThrow(lessonId);
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = user.id === authorId;

          (req as any).courseId = courseId;

          if (isAuthor || isAdmin) {
            isAuthorized = true;
          }

          if (!isAuthorized) {
            const enrollment = await this.courseEnrollmentTable.findUnique({
              where: {
                userId_courseId: {
                  userId: user.id,
                  courseId: courseId,
                },
              },
              select: {
                role: true,
              },
            });

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

  public getCreateLessonAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const body = req.body as CreateCourseLessonDto;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(body.courseId);
          const isAuthor = user.id === authorId;

          if (isAuthor) {
            isAuthorized = true;
          }

          if (!isAuthorized) {
            const enrollment = await this.courseEnrollmentTable.findUnique({
              where: {
                userId_courseId: {
                  userId: user.id,
                  courseId: body.courseId,
                },
              },
              select: {
                role: true,
              },
            });

            if (
              enrollment &&
              isEqualOrIncludeRole(enrollment.role, Role.INSTRUCTOR)
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
}
