import { Request, Response, NextFunction } from "express";
import dIContainer from "../../../inversifyConfig";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { PrismaClient, Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import { injectable } from "inversify";
import {
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../../enrollment/enrollment.type";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import RecordNotFoundException from "../../../common/exceptions/RecordNotFoundException";
import ClientException from "../../../common/exceptions/ClientException";

export interface ICourseEnrollmentAuthorizationMiddleware {
  getDeleteCourseEnrollmentAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getUpdateCourseEnrollmentAuthorizationMiddleWare: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  getCreateCourseEnrollmentAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

@injectable()
export class CourseEnrollmentAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseEnrollmentAuthorizationMiddleware
{
  private async checkEnrollmentRoleLogicOrThrow(
    enrollmentId: number,
    newEnrollmentRole: Role
  ) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        id: enrollmentId,
      },
      select: {
        userId: true,
        role: true,
      },
    });

    if (!enrollment) {
      throw new RecordNotFoundException();
    }

    if (isEqualOrIncludeRole(enrollment.role, newEnrollmentRole)) {
      throw new ClientException();
    }

    const userRole = await this.getUserRoleOrThrow(enrollment.userId);
    const { isStudent } = getRoleStatus(userRole);

    if (isStudent && isEqualOrIncludeRole(newEnrollmentRole, Role.INSTRUCTOR)) {
      throw new AuthorizationException();
    }
  }
  public getDeleteCourseEnrollmentAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        const isUserIdEqual = user.id === Number(req.params.userId);

        if (isStudent) {
          if (isUserIdEqual) {
            next();
          }

          throw new AuthorizationException();
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if ((isUserIdEqual && !isAuthor) || (!isUserIdEqual && isAuthor)) {
            next();
          }

          throw new AuthorizationException();
        }

        if (isAdmin) {
          if (!isUserIdEqual) {
            next();
          }

          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if (!isAuthor) {
            next();
          }

          throw new AuthorizationException();
        }

        throw new AuthorizationException();
      } catch (error) {
        next(error);
      }
    };
  }

  public getUpdateCourseEnrollmentAuthorizationMiddleWare() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const dto = req.body as UpdateCourseEnrollmentDto;
        const isUserIdEqual = user.id === dto.userId;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);

        if (isStudent) {
          throw new AuthorizationException();
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if (isAuthor && !isUserIdEqual) {
            await this.checkEnrollmentRoleLogicOrThrow(
              Number(req.params.enrollmentId),
              dto.role
            );

            next();
          }

          throw new AuthorizationException();
        }

        if (isAdmin) {
          if (!isUserIdEqual) {
            await this.checkEnrollmentRoleLogicOrThrow(
              Number(req.params.enrollmentId),
              dto.role
            );

            next();
          }

          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if (!isAuthor) {
            await this.checkEnrollmentRoleLogicOrThrow(
              Number(req.params.enrollmentId),
              dto.role
            );

            next();
          }

          throw new AuthorizationException();
        }

        throw new AuthorizationException();
      } catch (error) {
        next(error);
      }
    };
  }

  public getCreateCourseEnrollmentAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const dto = req.body as CreateCourseEnrollmentDto;
        const isUserIdEqual = user.id === dto.userId;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);

        if (isStudent) {
          if (isUserIdEqual && isEqualOrIncludeRole(dto.role, Role.STUDENT)) {
            next();
          }

          throw new AuthorizationException();
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if (
            isUserIdEqual &&
            !isAuthor &&
            isEqualOrIncludeRole(dto.role, Role.STUDENT)
          ) {
            next();
          }

          throw new AuthorizationException();
        }

        if (isAdmin) {
          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
          const isAuthor = user.id === authorId;

          if (isUserIdEqual && isAuthor) {
            throw new AuthorizationException();
          }

          next();
        }

        throw new AuthorizationException();
      } catch (error) {
        next(error);
      }
    };
  }
}
