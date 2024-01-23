import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { CreateCourseEnrollmentDto } from "../../enrollment/enrollment.type";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/authorization/BaseCourseAuthorization";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import { UserRoleModel } from "../../course/course.type";

export interface ICourseEnrollmentAuthorizationMiddleware {
  getCreateEnrollmentAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getUpdateEnrollmentRoleAuthorizationMiddleWare: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDeleteEnrollmentAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export class CourseEnrollmentAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseEnrollmentAuthorizationMiddleware
{
  public getCreateEnrollmentAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const dto = req.body as CreateCourseEnrollmentDto;
        const isUserIdEqual = userId === dto.userId;
        const authorId = await this.getAuthorIdOrThrow(dto.courseId);
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
          if (
            isUserIdEqual &&
            isEqualOrIncludeRole(dto.role, [UserRoleModel.STUDENT])
          ) {
            isAuthorized = true;
          }
        }

        if (isInstructor) {
          if (
            isUserIdEqual &&
            !isAuthor &&
            isEqualOrIncludeRole(dto.role, [UserRoleModel.STUDENT])
          ) {
            isAuthorized = true;
          }
        }

        if (isAdmin) {
          if (!(isAuthor && isUserIdEqual)) {
            isAuthorized = true;
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

  public getUpdateEnrollmentRoleAuthorizationMiddleWare() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const dto = req.body as CreateCourseEnrollmentDto;
        const isUserIdEqual = userId === dto.userId;
        const authorId = await this.getAuthorIdOrThrow(dto.courseId);
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }

        if (isInstructor) {
          if (isInstructor && isAuthor && !isUserIdEqual) {
            isAuthorized = true;
          }
        }

        if (isAdmin) {
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

  public getDeleteEnrollmentAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const { id: userId, role: userRole } =
          getRequestUserOrThrowAuthenticationException(req);
        const dto = req.body as CreateCourseEnrollmentDto;
        const isUserIdEqual = userId === dto.userId;
        const authorId = await this.getAuthorIdOrThrow(dto.courseId);
        const isAuthor = userId === authorId;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(userRole);
        let isAuthorized = false;

        if (isStudent) {
          if (isUserIdEqual) {
            isAuthorized = true;
          }
        }

        if (isInstructor) {
          if (!(!isAuthor && !isUserIdEqual)) {
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
}
