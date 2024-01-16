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
import RecordNotFoundException from "../../../common/exceptions/RecordNotFoundException";
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
        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
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
          throw new ClientException("Invalid courseId (NaN)");
        }

        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor) {
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

  public getDeleteCourseAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
          throw new ClientException("Invalid courseId (NaN)");
        }
        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;
        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(courseId);
          const isAuthor = user.id === authorId;

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
        if (isStudent || isInstructor) {
          const enrollment = await this.getEnrollmentById(userId, courseId);

          if (
            enrollment &&
            isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
          ) {
            isAuthorized = true;

            (req as any).resourceId = {
              courseId: enrollment.courseId,
            } satisfies CourseLikeResourceId;
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
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const courseId = Number(req.params.courseId);
        const likeId = Number(req.params.likeId);
        if (isNaNArray([courseId, likeId])) {
          throw new ClientException("Invalid courseId || likeId (NaN)");
        }

        const like = await this.getLikeById(likeId);
        if (!like) {
          throw new RecordNotFoundException();
        }

        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;
        if (isStudent || isInstructor) {
          if (like.courseId !== courseId) {
            throw new ClientException("likeId doesn't match courseId");
          }

          if (like.userId === user.id) {
            isAuthorized = true;
          }

          (req as any).resourceId = {
            courseId: courseId,
            likeId: likeId,
          } satisfies CourseLikeResourceId;
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
