import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import { CourseLikeResourceId } from "../course.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import ClientException from "../../../common/exceptions/ClientException";
import isNaNArray from "../../../common/functions/isNaNArray";
import { ErrorCode } from "../../../common/constants/errorCode";
import { ErrorMessage } from "../../../common/constants/errorMessage";

export interface ICourseAuthorizationMiddleware {
  /**
   * Course
   *
   */
  getCreateCourseAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateCourseAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getDeleteCourseAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  /**
   * CourseLike
   *
   */
  getCreateCourseLikeAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getDeleteCourseLikeAuthorization: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export class CourseAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseAuthorizationMiddleware
{
  /**
   * Course
   *
   */
  public getCreateCourseAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
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

  public getDeleteCourseAuthorizationMiddleware() {
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

  /**
   * Course Like
   *
   */
  public getCreateCourseLikeAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
          throw new HttpException(
            StatusCode.BAD_REQUEST,
            ErrorCode.INVALID_QUERY,
            (ErrorMessage.NAN_PARAMS as (params: string) => string)("courseId"),
            true
          );
        }

        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent || isInstructor || isAdmin) {
          const enrollmentRole = await this.getEnrollmentRoleById(userId, courseId);

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

        (req as any).resourceId = {
          courseId,
        } satisfies CourseLikeResourceId;

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getDeleteCourseLikeAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const likeId = Number(req.params.likeId);
        if (isNaNArray([courseId, likeId])) {
          throw new ClientException();
        }

        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent || isInstructor || isAdmin) {
          await this.getLikeByIdOrThrow(courseId, likeId, userId);

          isAuthorized = true;
        }

        if (!isAuthorized) {
          throw new AuthorizationException();
        }

        (req as any).resourceId = {
          courseId: courseId,
          likeId: likeId,
        } satisfies CourseLikeResourceId;

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
