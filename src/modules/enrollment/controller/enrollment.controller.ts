import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import {
  CourseEnrollmentDITypes,
  CourseEnrollmentResourceId,
} from "../enrollment.type";
import { ICourseEnrollmentService } from "../service/enrollment.service";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseEnrollmentDtoJoi,
  UpdateCourseEnrollmentRoleDtoJoi,
} from "./enrollment.joi";

export interface ICourseEnrollmentController {
  createEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateEnrollmentRole: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

@injectable()
export class CourseEnrollmentController implements ICourseEnrollmentController {
  @inject(CourseEnrollmentDITypes.SERVICE)
  service: ICourseEnrollmentService;

  public async createEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({
        body: CreateCourseEnrollmentDtoJoi,
      })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newEnrollment = await this.service.createEnrollment(
        resourceId,
        req.body,
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json({ data: newEnrollment });
    } catch (error) {
      next(error);
    }
  }

  public async updateEnrollmentRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseEnrollmentRoleDtoJoi })(
        req,
        res,
        next,
      );

      const enrollmentId = this.validateEnrollmentId(req);
      const resourceId = this.validateResourceId(req);
      const updatedEnrollment = await this.service.updateEnrollmentRole(
        enrollmentId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedEnrollment });
    } catch (error) {
      next(error);
    }
  }

  public async deleteEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const enrollmentId = this.validateEnrollmentId(req);
      const resourceId = this.validateResourceId(req);
      const deletedEnrollment = await this.service.deleteEnrollment(
        enrollmentId,
        resourceId,
      );

      return res.status(StatusCode.SUCCESS).json({ data: deletedEnrollment });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
    error?: Error,
  ): CourseEnrollmentResourceId {
    const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw error || new NaNException("courseId");
    }

    return {
      userId,
      courseId,
    };
  }

  private validateEnrollmentId(req: Request, error?: Error): number {
    const enrollmentId: number = Number(req.params.enrollmentId);
    if (isNaN(enrollmentId)) {
      throw error || new NaNException("enrollmentId");
    }

    return enrollmentId;
  }
}
