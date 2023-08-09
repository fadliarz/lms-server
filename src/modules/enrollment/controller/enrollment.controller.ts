import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { CourseEnrollmentDITypes } from "../enrollment.type";
import { ICourseEnrollmentService } from "../service/enrollment.service";
import { handleError } from "../../../common/exceptions/handleError";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/response/getResponseJson";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

export interface ICourseEnrollmentController {
  deleteEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseEnrollmentController implements ICourseEnrollmentController {
  @inject(CourseEnrollmentDITypes.COURSE_ENROLLMENT_SERVICE)
  courseEnrollmentService: ICourseEnrollmentService;

  public async deleteEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const deletedEnrollment =
        await this.courseEnrollmentService.deleteEnrollment(
          user.id,
          req.params.courseId
        );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedEnrollment));
    } catch (error) {
      handleError(error, next);
    }
  }

  public async createEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const enrollment = await this.courseEnrollmentService.createEnrollment(
        req.body
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, enrollment));
    } catch (error) {
      handleError(error, next);
    }
  }
}
