import { injectable } from "inversify";
import {
  CourseLessonAuthorizationMiddleware,
  ICourseLessonAuthorizationMiddleware,
} from "../../lesson/authorization/lesson.authorization";
import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { CourseLessonVideoResourceId } from "../video.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { Role } from "@prisma/client";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import ClientException from "../../../common/exceptions/ClientException";
import isNaNArray from "../../../common/functions/isNaNArray";
import InternalServerException from "../../../common/exceptions/InternalServerException";
import { ErrorCode } from "../../../common/constants/errorCode";
import { ErrorMessage } from "../../../common/constants/errorMessage";

export interface ICourseLessonVideoAuthorizationMiddleware
  extends ICourseLessonAuthorizationMiddleware {
  getCreateVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getGetVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateVideoAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getDeleteVideoAuthorizationMiddleware: () => (
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
  public getCreateVideoAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.lessonId);
        if (isNaNArray([courseId, lessonId])) {
          throw new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_QUERY,
            (ErrorMessage.NAN_PARAMS as (params: string) => string)(
              "courseId || lessonId"
            ),
            true
          );
        }

        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          const courseIdFromLessonId = await this.getCourseIdByLessonId(
            lessonId
          );
          if (courseId !== courseIdFromLessonId) {
            throw new ClientException("lessonId doesn't match courseId");
          }

          const authorId = await this.getAuthorIdOrThrow(
            courseId,
            new InternalServerException()
          );
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

          (req as any).resourceId = {
            courseId,
            lessonId,
          } as CourseLessonVideoResourceId;
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
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.courseId);
        const videoId = Number(req.params.videoId);
        if (isNaNArray([courseId, lessonId, videoId])) {
          throw new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_QUERY,
            (ErrorMessage.NAN_PARAMS as (params: string) => string)(
              "courseId || lessonId || videoId"
            ),
            true
          );
        }

        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;
        if (isStudent || isInstructor) {
          const lessonIdFromVideoId = await this.getLessonIdByVideoIdOrThrow(
            videoId
          );
          if (lessonId !== lessonIdFromVideoId) {
            throw new ClientException("videoId doesn't match lessonId");
          }

          const courseIdFromLessonId = await this.getCourseIdByLessonId(
            lessonId
          );
          if (courseId !== courseIdFromLessonId) {
            throw new ClientException("lessonId doesn't match courseId");
          }

          const authorId = await this.getAuthorIdOrThrow(
            courseId,
            new InternalServerException()
          );
          const isAuthor = user.id === authorId;
          if (isAuthor) {
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

            if (enrollment) {
              isAuthorized = true;
            }
          }

          (req as any).resourceId = {
            lessonId,
            courseId,
            videoId,
          } as CourseLessonVideoResourceId;
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
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.courseId);
        const videoId = Number(req.params.videoId);
        if (isNaNArray([courseId, lessonId, videoId])) {
          throw new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_QUERY,
            (ErrorMessage.NAN_PARAMS as (params: string) => string)(
              "courseId || lessonId || videoId"
            ),
            true
          );
        }

        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          const lessonIdFromVideoId = await this.getLessonIdByVideoIdOrThrow(
            videoId
          );
          if (lessonId !== lessonIdFromVideoId) {
            throw new ClientException("videoId doesn't match lessonId");
          }

          const courseIdFromLessonId = await this.getCourseIdByLessonId(
            lessonId
          );
          if (courseId !== courseIdFromLessonId) {
            throw new ClientException("lessonId doesn't match courseId");
          }

          const authorId = await this.getAuthorIdOrThrow(
            courseId,
            new InternalServerException()
          );
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

          (req as any).resourceId = {
            lessonId,
            courseId,
            videoId,
          } as CourseLessonVideoResourceId;
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

  public getDeleteVideoAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.courseId);
        const videoId = Number(req.params.videoId);
        if (isNaNArray([courseId, lessonId, videoId])) {
          throw new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_QUERY,
            (ErrorMessage.NAN_PARAMS as (params: string) => string)(
              "courseId || lessonId || videoId"
            ),
            true
          );
        }

        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          const lessonIdFromVideoId = await this.getLessonIdByVideoIdOrThrow(
            videoId
          );
          if (lessonId !== lessonIdFromVideoId) {
            throw new ClientException("videoId doesn't match lessonId");
          }

          const courseIdFromLessonId = await this.getCourseIdByLessonId(
            lessonId
          );
          if (courseId !== courseIdFromLessonId) {
            throw new ClientException("lessonId doesn't match courseId");
          }

          const authorId = await this.getAuthorIdOrThrow(
            courseId,
            new InternalServerException()
          );
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

          (req as any).resourceId = {
            lessonId,
            courseId,
            videoId,
          } as CourseLessonVideoResourceId;
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
