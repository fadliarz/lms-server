import { Request, Response, NextFunction } from "express";
import dIContainer from "../../../inversifyConfig";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { CourseEnrollment, PrismaClient, Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import { injectable } from "inversify";
import {
  CreateCourseEnrollmentDto,
  DeleteCourseEnrollmentIds,
  UpdateCourseEnrollmentDto,
  UpdateCourseEnrollmentIds,
} from "../../enrollment/enrollment.type";
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
    enrollmentRole: Role,
    newEnrollmentRole: Role,
    userRole: Role
  ) {
    if (isEqualOrIncludeRole(enrollmentRole, newEnrollmentRole)) {
      throw new ClientException("Current role and new role are identic!");
    }

    if (
      isEqualOrIncludeRole(userRole, Role.STUDENT) &&
      isEqualOrIncludeRole(newEnrollmentRole, Role.INSTRUCTOR)
    ) {
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
        let isAuthorized = false;

        const enrollment = await this.courseEnrollmentTable.findUnique({
          where: { id: Number(req.params.enrollmentId) },
        });

        // if the enrollment user is the course author itself, this must be satisfied
        if (!enrollment) {
          throw new AuthorizationException();
        }

        const isUserIdEqual = user.id === enrollment.userId;

        if (isStudent && isUserIdEqual) {
          isAuthorized = true;
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(enrollment.courseId);
          const isAuthor = user.id === authorId;

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

        (req as any).enrollment = enrollment satisfies CourseEnrollment;
        (req as any).ids = {
          courseId: enrollment.courseId,
        } satisfies DeleteCourseEnrollmentIds;

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
        const enrollmentId = Number(req.params.enrollmentId);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isStudent) {
        }

        if (isInstructor || isAdmin) {
          const enrollment = await this.courseEnrollmentTable.findUnique({
            where: {
              id: enrollmentId,
            },
          });

          // if the enrollment user is the course author itself, this must be satisfied
          if (!enrollment) {
            throw new AuthorizationException();
          }

          const authorId = await this.getAuthorIdOrThrow(
            enrollment.courseId,
            new AuthorizationException()
          );
          const isAuthor = user.id === authorId;

          if (isAuthor || isAdmin) {
            isAuthorized = true;
          }

          if (!(isInstructor && !isAuthor)) {
            isAuthorized = true;
          }

          if (isAuthorized) {
            const { role } = await this.userTable.findUniqueOrThrow({
              where: {
                id: enrollment.userId,
              },
              select: {
                role: true,
              },
            });

            await this.checkEnrollmentRoleLogicOrThrow(
              enrollment.role,
              dto.role,
              role
            );

            (req as any).ids = {
              courseId: enrollment.courseId,
            } satisfies UpdateCourseEnrollmentIds;
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
        let isAuthorized = false;

        if (isStudent) {
          if (isUserIdEqual && isEqualOrIncludeRole(dto.role, Role.STUDENT)) {
            isAuthorized = true;
          }
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(dto.courseId);
          const isAuthor = user.id === authorId;

          if (
            isUserIdEqual &&
            !isAuthor &&
            isEqualOrIncludeRole(dto.role, Role.STUDENT)
          ) {
            isAuthorized = true;
          }
        }

        if (isAdmin) {
          const authorId = await this.getAuthorIdOrThrow(dto.courseId);
          const isAuthor = user.id === authorId;

          if (!(isAuthor && isUserIdEqual)) {
            isAuthorized = true;
          }
        }

        let userGettingEnrolledRole = user.role satisfies Role;

        if (!isUserIdEqual) {
          const userGettingEnrolled = await this.userTable.findUnique({
            where: {
              id: dto.userId,
            },
            select: {
              role: true,
            },
          });

          if (!userGettingEnrolled) {
            throw new RecordNotFoundException("User not found!");
          }

          userGettingEnrolledRole = userGettingEnrolled.role;
        }

        if (
          isEqualOrIncludeRole(dto.role, Role.INSTRUCTOR) &&
          !isEqualOrIncludeRole(userGettingEnrolledRole, [
            Role.INSTRUCTOR,
            Role.OWNER,
          ])
        ) {
          throw new AuthorizationException();
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
