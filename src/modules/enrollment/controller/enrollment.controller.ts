import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
} from "../enrollment.type";
import { ICourseEnrollmentService } from "../service/enrollment.service";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/response/getResponseJson";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

export interface ICourseEnrollmentController {
  deleteEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateEnrollment: (
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
  @inject(CourseEnrollmentDITypes.SERVICE)
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
          (req as any).enrollment as CourseEnrollmentModel
        );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedEnrollment));
    } catch (error) {
      next(error);
    }
  }

  public async updateEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const updatedEnrollment =
        await this.courseEnrollmentService.updateEnrollment(
          Number(req.params.enrollmentId),
          req.body
        );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedEnrollment));
    } catch (error) {
      next(error);
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
      next(error);
    }
  }
}
