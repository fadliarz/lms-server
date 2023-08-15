import { Request, Response, NextFunction } from "express";
import dIContainer from "../../../inversifyConfig";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { PrismaClient, Role } from "@prisma/client";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";
import { injectable } from "inversify";
import {
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../../enrollment/enrollment.type";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import { isEqualOrIncludeRole } from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";

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
  getCourseEnrollmentRoleAuthorization: (
    role: Role | Role[]
  ) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

@injectable()
export class CourseEnrollmentAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseEnrollmentAuthorizationMiddleware
{
  public getDeleteCourseEnrollmentAuthorizationMiddleware() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const isAdmin = isEqualOrIncludeRole(user.role, Role.OWNER);
        const enrollmentId = Number(req.params.enrollmentId);
        const enrollment = await this.prisma.courseEnrollment.findUniqueOrThrow(
          {
            where: {
              id: enrollmentId,
            },
          }
        );

        const isDeletingOthers = user.id !== enrollment.userId;
        const authorId = await this.getCourseOwnerUserIdOrThrow(
          enrollment.courseId
        );
        const isAuthor = user.id === authorId;

        if (isDeletingOthers) {
          if (!isAuthor && !isAdmin) {
            throw new AuthorizationException();
          }
        }

        next();
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

        const enrollment = await this.prisma.courseEnrollment.findUniqueOrThrow(
          {
            where: {
              id: Number(req.params.enrollmentId),
            },
          }
        );

        const isAdmin = isEqualOrIncludeRole(user.role, Role.OWNER);
        const isUpdatingOther = user.id !== enrollment.userId;
        const authorId = await this.getCourseOwnerUserIdOrThrow(
          enrollment.courseId
        );
        const isAuthor = user.id === authorId;

        if (isUpdatingOther) {
          if (!isAuthor && !isAdmin) {
            throw new AuthorizationException();
          }

          if (dto.role.toString() === enrollment.toString()) {
            throw new HttpException(StatusCode.CONFLICT, "Identical role!");
          }

          const userGettingEnrolled = await this.getUserOrThrow(
            enrollment.userId
          );

          if (
            isEqualOrIncludeRole(dto.role, Role.INSTRUCTOR) &&
            !isEqualOrIncludeRole(userGettingEnrolled.role, [Role.INSTRUCTOR])
          ) {
            throw new AuthorizationException();
          }
        }

        if (isAuthor) {
          throw new AuthorizationException();
        }

        if (!isAdmin) {
          throw new AuthorizationException();
        }

        await this.getCourseEnrollmentOrThrow(
          enrollment.userId,
          enrollment.courseId
        );

        next();
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
        const isAdmin = isEqualOrIncludeRole(user.role, Role.OWNER);
        const isInstructor = isEqualOrIncludeRole(user.role, Role.INSTRUCTOR);
        const isStudent = isEqualOrIncludeRole(user.role, Role.STUDENT);
        const isEnrollingOther = user.id !== dto.userId;
        const authorId = await this.getCourseOwnerUserIdOrThrow(dto.courseId);
        const isAuthor = user.id === authorId;

        if (isEnrollingOther) {
          if (!isAdmin) {
            throw new AuthorizationException(
              "Unauthorized from enrolling others!"
            );
          }

          if (authorId === dto.userId) {
            throw new AuthorizationException();
          }

          const userGettingEnrolled = await this.getUserOrThrow(dto.userId);

          if (
            isEqualOrIncludeRole(dto.role, Role.INSTRUCTOR) &&
            !isEqualOrIncludeRole(userGettingEnrolled.role, [Role.INSTRUCTOR])
          ) {
            throw new AuthorizationException();
          }
        }

        if (isAuthor) {
          throw new AuthorizationException();
        }

        if (
          (isStudent || isInstructor) &&
          !isEqualOrIncludeRole(dto.role, [Role.STUDENT])
        ) {
          throw new AuthorizationException();
        }

        await this.isNotEnrolledOrThrow(dto.userId, dto.courseId);

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  public getCourseEnrollmentRoleAuthorization(role: Role | Role[]) {
    return async (
      req: any,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const prisma = dIContainer.get<PrismaClient>(
          databaseDITypes.PRISMA_CLIENT
        );
        const courseEnrollmentTable = prisma.courseEnrollment;
        const enrollment = await courseEnrollmentTable.findUnique({
          where: {
            userId_courseId: {
              userId: req.user.id,
              courseId: req.params.courseId,
            },
          },
          select: {
            role: true,
          },
        });

        if (!enrollment) {
          throw new AuthorizationException();
        }

        const userRole = enrollment.role;

        if (Array.isArray(role)) {
          const roles = role.map((value) => value.toString());

          if (!roles.includes(userRole.toString())) {
            throw new AuthorizationException();
          }
        } else {
          const roles = [Role.STUDENT, Role.INSTRUCTOR, Role.OWNER].map(
            (role) => role.toString()
          );

          if (
            roles.indexOf(userRole.toString()) < roles.indexOf(role.toString())
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
