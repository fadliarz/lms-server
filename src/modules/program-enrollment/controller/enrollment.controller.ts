import {
  IDepartmentProgramEnrollmentController,
  IDepartmentProgramEnrollmentService,
} from "../enrollment.interface";
import { inject, injectable } from "inversify";
import {
  DepartmentProgramEnrollmentDITypes,
  DepartmentProgramEnrollmentResourceId,
} from "../enrollment.type";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import { CreateDepartmentProgramEnrollmentDtoJoi } from "./enrollment.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

@injectable()
export default class DepartmentProgramEnrollmentController
  implements IDepartmentProgramEnrollmentController
{
  @inject(DepartmentProgramEnrollmentDITypes.SERVICE)
  private readonly service: IDepartmentProgramEnrollmentService;

  public async createEnrollment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({
        body: CreateDepartmentProgramEnrollmentDtoJoi,
      })(req, res, next);

      const newEnrollment = await this.service.createEnrollment(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newEnrollment,
      });
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
      });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
  ): DepartmentProgramEnrollmentResourceId {
    const departmentId: number = Number(req.params.departmentId);
    const programId: number = Number(req.params.programId);
    if (isNaNArray([departmentId, programId])) {
      throw new NaNException("departmentId  || programId");
    }

    return {
      departmentId,
      programId,
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
