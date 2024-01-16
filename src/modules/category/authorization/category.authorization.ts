import { Request, Response, NextFunction } from "express";
import { BaseCourseAuthorization } from "../../../common/class/BaseCourseAuthorization";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";

export interface ICourseCategoryAuthorizationMiddleware {
  getCreateCategoryAuthorizationMiddleware: () => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export class CourseCategoryAuthorizationMiddleware
  extends BaseCourseAuthorization
  implements ICourseCategoryAuthorizationMiddleware
{
  public getCreateCategoryAuthorizationMiddleware() {
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
