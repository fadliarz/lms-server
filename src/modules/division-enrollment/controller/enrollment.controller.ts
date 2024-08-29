import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import validateJoi from "../../../common/functions/validateJoi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import {
  IDepartmentDivisionEnrollmentController,
  IDepartmentDivisionEnrollmentService,
} from "../enrollment.interface";
import {
  DepartmentDivisionEnrollmentDITypes,
  DepartmentDivisionEnrollmentResourceId,
} from "../enrollment.type";
import { CreateDepartmentDivisionEnrollmentDtoJoi } from "./enrollment.joi";
import { $DepartmentDivisionEnrollmentAPI } from "../enrollment.api";

@injectable()
export default class DepartmentDivisionEnrollmentController
  implements IDepartmentDivisionEnrollmentController
{
  @inject(DepartmentDivisionEnrollmentDITypes.SERVICE)
  service: IDepartmentDivisionEnrollmentService;

  public async createEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateDepartmentDivisionEnrollmentDtoJoi })(
        req,
        res,
        next,
      );

      const newEnrollment = await this.service.createEnrollment(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newEnrollment,
      } satisfies $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getEnrollments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const enrollments = await this.service.getEnrollments({
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: enrollments,
      } satisfies $DepartmentDivisionEnrollmentAPI.GetEnrollments.Response);
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
      await this.service.deleteEnrollment(
        getRequestUserOrThrowAuthenticationException(req),
        {
          enrollmentId: this.validateEnrollmentId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      } satisfies $DepartmentDivisionEnrollmentAPI.DeleteEnrollment.Response);
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
  ): DepartmentDivisionEnrollmentResourceId {
    const departmentId: number = Number(req.params.departmentId);
    const divisionId: number = Number(req.params.divisionId);
    if (isNaNArray([departmentId, divisionId])) {
      throw new NaNException("departmentId || divisionId");
    }

    return {
      departmentId,
      divisionId,
    };
  }

  private validateEnrollmentId(req: Request): number {
    const enrollmentId: number = Number(req.params.enrollmentId);
    if (isNaN(enrollmentId)) {
      throw new NaNException("enrollmentId");
    }

    return enrollmentId;
  }
}
