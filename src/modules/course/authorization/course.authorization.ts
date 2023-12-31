import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import processQuery from "../../../common/functions/processQuery";
import {
  CreateCourseLikeDto,
  CreateCourseLikeIds,
  DeleteCourseLikeIds,
  GetCourseQuery,
  GetCoursesQuery,
} from "../course.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";

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
  getCoursesAuthorization: () => (
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
        const likeId = Number(req.params.likeId);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isAdmin || isInstructor || isStudent) {
          const like = await this.prisma.courseLike.findUniqueOrThrow({
            where: {
              id: likeId,
            },
          });

          const enrollment = await this.prisma.courseEnrollment.findUnique({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: like.courseId,
              },
            },
            select: {
              role: true,
            },
          });

          console.log(enrollment);

          if (
            enrollment &&
            isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
          ) {
            isAuthorized = true;
          }

          (req as any).ids = {
            courseId: like.courseId,
          } satisfies DeleteCourseLikeIds;
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

  public getCreateCourseLikeAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const body = req.body as CreateCourseLikeDto;
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isAdmin || isInstructor || isStudent) {
          const enrollment = await this.prisma.courseEnrollment.findUnique({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: body.courseId,
              },
            },
            select: {
              role: true,
              courseId: true,
            },
          });

          if (
            enrollment &&
            isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
          ) {
            isAuthorized = true;

            (req as any).ids = {
              courseId: enrollment.courseId,
            } satisfies CreateCourseLikeIds;
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

  public getDeleteCourseAuthorization() {
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
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
          );
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

  public getUpdateCourseAuthorization() {
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
        }

        if (isInstructor) {
          const authorId = await this.getAuthorIdOrThrow(
            Number(req.params.courseId)
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
                  courseId: Number(req.params.courseId),
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

  public getCoursesAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const query = req.query as GetCoursesQuery;
        const courseRoleQuery = processQuery({
          include_owned_courses: query.include_owned_courses,
          include_instructor_courses: query.include_instructor_courses,
          include_student_courses: query.include_student_courses,
        });
        const { isAdmin, isInstructor } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (
          courseRoleQuery.include_instructor_courses ||
          courseRoleQuery.include_owned_courses
        ) {
          if (isAdmin || isInstructor) {
            isAuthorized = true;
          }
        } else {
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

  public getCourseByIdAuthorization() {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const user = getRequestUserOrThrowAuthenticationException(req);
        const query = processQuery(req.query as GetCourseQuery);
        const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
        let isAuthorized = false;

        if (isInstructor || isStudent) {
          if (query.include_videos) {
            const authorId = await this.getAuthorIdOrThrow(
              Number(req.params.courseId)
            );
            const isAuthor = user.id === authorId;

            if (isAuthor) {
              isAuthorized = true;
            }

            if (!isAuthorized) {
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

              if (enrollment) {
                isAuthorized = true;
              }
            }
          } else {
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

  public getCreateCourseAuthorization() {
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
}
