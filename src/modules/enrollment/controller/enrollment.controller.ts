import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentModel,
  DeleteCourseEnrollmentIds,
} from "../enrollment.type";
import { ICourseEnrollmentService } from "../service/enrollment.service";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/functions/getResponseJson";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

export interface ICourseEnrollmentController {
  delete: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  update: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  create: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseEnrollmentController implements ICourseEnrollmentController {
  @inject(CourseEnrollmentDITypes.SERVICE)
  service: ICourseEnrollmentService;

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedEnrollment = await this.service.delete(
        Number(req.params.enrollmentId),
        (req as any).ids,
        (req as any).enrollment
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedEnrollment));
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const updatedEnrollment = await this.service.update(
        Number(req.params.enrollmentId),
        (req as any).ids,
        req.body
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedEnrollment));
    } catch (error) {
      next(error);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const enrollment = await this.service.create(req.body);

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, enrollment));
    } catch (error) {
      next(error);
    }
  }
}
