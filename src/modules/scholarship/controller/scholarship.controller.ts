import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  IScholarshipController,
  IScholarshipService,
} from "../scholarship.interface";
import { ScholarshipDITypes } from "../scholarship.type";
import {
  CreateScholarshipDtoJoi,
  UpdateScholarshipDtoJoi,
} from "./scholarship.joi";
import { $ScholarshipAPI } from "../scholarship.api";

@injectable()
export default class ScholarshipController implements IScholarshipController {
  @inject(ScholarshipDITypes.SERVICE)
  private readonly service: IScholarshipService;

  public async createScholarship(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      validateJoi({ body: CreateScholarshipDtoJoi });

      const user = getRequestUserOrThrowAuthenticationException(req);
      const newScholarship = await this.service.createScholarship(
        user,
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newScholarship,
      } satisfies $ScholarshipAPI.CreateScholarship.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getScholarships(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      getRequestUserOrThrowAuthenticationException(req);

      const scholarships = await this.service.getScholarships();

      return res.status(StatusCode.SUCCESS).json({
        data: scholarships,
      } satisfies $ScholarshipAPI.GetScholarships.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getScholarshipById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      getRequestUserOrThrowAuthenticationException(req);
      const scholarshipId = this.validateScholarshipId(req);
      const scholarship = await this.service.getScholarshipById(scholarshipId);

      return res.status(StatusCode.SUCCESS).json({
        data: scholarship,
      } satisfies $ScholarshipAPI.GetScholarshipById.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateScholarship(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({
        body: UpdateScholarshipDtoJoi,
      })(req, res, next);

      const user = getRequestUserOrThrowAuthenticationException(req);
      const scholarshipId = this.validateScholarshipId(req);
      const updatedReport = await this.service.updateScholarship(
        scholarshipId,
        user,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedReport,
      } satisfies $ScholarshipAPI.UpdateScholarship.Response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteScholarship(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const scholarshipId = this.validateScholarshipId(req);
      await this.service.deleteScholarship(scholarshipId, user);

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      } satisfies $ScholarshipAPI.DeleteScholarship.Response);
    } catch (error) {
      next(error);
    }
  }

  private validateScholarshipId(req: Request): number {
    const scholarshipId: number = Number(req.params.scholarshipId);
    if (isNaN(scholarshipId)) {
      throw new NaNException("scholarshipId");
    }

    return scholarshipId;
  }
}
