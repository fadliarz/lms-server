import { injectable } from "inversify";
import {
  CourseLessonAuthorizationMiddleware,
  ICourseLessonAuthorizationMiddleware,
} from "../../lesson/authorization/lesson.authorization";
import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import {
  CreateCourseLessonVideoDto,
  CreateCourseLessonVideoIds,
  DeleteCourseLessonVideoIds,
  UpdateCourseLessonVideoDto,
  UpdateCourseLessonVideoIds,
} from "../video.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { CourseLessonVideo, Role } from "@prisma/client";

export interface ICourseLessonVideoAuthorizationMiddleware
  extends ICourseLessonAuthorizationMiddleware {
  getDeleteVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getCreateVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

@injectable()
export class CourseLessonVideoAuthorizationMiddleware
  extends CourseLessonAuthorizationMiddleware
  implements ICourseLessonVideoAuthorizationMiddleware
{
  public getDeleteVideoAuthorizationMiddleware() {
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
          const videoId = Number(req.params.videoId);
          const lessonId = await this.getLessonIdByVideoIdOrThrow(videoId);
          const courseId = await this.getCourseIdByLessonIdOrThrow(lessonId);
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = user.id === authorId;

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

          (req as any).ids = {
            lessonId,
            courseId,
            videoId,
          } as DeleteCourseLessonVideoIds;

          (req as any).video = (await this.getVideoById(
            videoId
          )) as CourseLessonVideo;
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
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const body = req.body as UpdateCourseLessonVideoDto;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor || isAdmin) {
          const videoId = Number(req.params.videoId);
          const lessonId = await this.getLessonIdByVideoIdOrThrow(videoId);
          const courseId = await this.getCourseIdByLessonIdOrThrow(lessonId);
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = user.id === authorId;

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

          (req as any).ids = {
            lessonId,
            courseId,
            videoId,
          } as UpdateCourseLessonVideoIds;

          (req as any).video = (await this.getVideoById(
            videoId
          )) as CourseLessonVideo;
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

  public getCreateVideoAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const body = req.body as CreateCourseLessonVideoDto;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor || isAdmin) {
          const courseId = await this.getCourseIdByLessonIdOrThrow(
            body.lessonId
          );
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = user.id === authorId;

          if (isAuthor || isAdmin) {
            isAuthorized = true;
          }

          if (!isAuthorized) {
            const enrollment = await this.courseEnrollmentTable.findUnique({
              where: {
                userId_courseId: {
                  userId: user.id,
                  courseId,
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

          (req as any).ids = {
            lessonId: body.lessonId,
            courseId,
          } as CreateCourseLessonVideoIds;
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
