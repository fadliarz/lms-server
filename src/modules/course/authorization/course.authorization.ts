import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import processQuery from "../../../common/functions/processQuery";
import { GetCourseQuery } from "../course.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";

export interface ICourseAuthorizationMiddleware {
  // getDeleteCourseLikeAuthorization: () => (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<void>;
  // getCreateCourseLikeAuthorization: () => (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<void>;
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
  // getCourseByIdAuthorization: () => (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<void>;
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
  // public getDeleteCourseLikeAuthorization() {
  //   return this.getCreateCourseLikeAuthorization();
  // }

  // public getCreateCourseLikeAuthorization() {
  //   return async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     try {
  //       const user = getRequestUserOrThrowAuthenticationException(req);
  //       const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
  //       let isAuthorized = false;

  //       if (isAdmin || isInstructor || isStudent) {
  //         const enrollment = await this.prisma.courseEnrollment.findUnique({
  //           where: {
  //             userId_courseId: {
  //               userId: user.id,
  //               courseId: Number(req.params.courseId),
  //             },
  //           },
  //           select: {
  //             role: true,
  //           },
  //         });

  //         if (
  //           enrollment &&
  //           isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
  //         ) {
  //           isAuthorized = true;
  //         }
  //       }

  //       if (!isAuthorized) {
  //         throw new AuthorizationException();
  //       }

  //       next();
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
  // }

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

  // public getCourseByIdAuthorization() {
  //   return async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     try {
  //       const user = getRequestUserOrThrowAuthenticationException(req);
  //       const query = processQuery(req.query as GetCourseQuery);
  //       const { isAdmin, isInstructor, isStudent } = getRoleStatus(user.role);
  //       let isAuthorized = false;

  //       if (isInstructor || isStudent) {
  //         if (query.include_videos || query.include_videos) {
  //           const authorId = await this.getAuthorIdOrThrow(
  //             Number(req.params.courseId)
  //           );
  //           const isAuthor = user.id === authorId;

  //           if (isAuthor) {
  //             isAuthorized = true;
  //           }

  //           if (!isAuthorized) {
  //             const enrollment = await this.prisma.courseEnrollment.findUnique({
  //               where: {
  //                 userId_courseId: {
  //                   userId: user.id,
  //                   courseId: Number(req.params.courseId),
  //                 },
  //               },
  //               select: {
  //                 id: true,
  //               },
  //             });

  //             if (enrollment) {
  //               isAuthorized = true;
  //             }
  //           }
  //         }
  //       }

  //       if (isAdmin) {
  //         isAuthorized = true;
  //       }

  //       if (!isAuthorized) {
  //         throw new AuthorizationException();
  //       }

  //       next();
  //     } catch (error) {
  //       next(error);
  //     }
  //   };
  // }

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
