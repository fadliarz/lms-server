import { inject, injectable } from "inversify";
import {
  IDepartmentDivisionController,
  IDepartmentDivisionService,
} from "../division.interface";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  DepartmentDivisionDITypes,
  DepartmentDivisionResourceId,
} from "../division.type";
import {
  CreateDepartmentDivisionDtoJoi,
  UpdateDepartmentDivisionCoLeaderIdDtoJoi,
  UpdateDepartmentDivisionDtoJoi,
  UpdateDepartmentDivisionLeaderIdDtoJoi,
} from "./division.joi";
import { $DepartmentDivisionAPI } from "../division.api";

@injectable()
export default class DepartmentDivisionController
  implements IDepartmentDivisionController
{
  @inject(DepartmentDivisionDITypes.SERVICE)
  private readonly service: IDepartmentDivisionService;

  public async createDivision(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateDepartmentDivisionDtoJoi })(
        req,
        res,
        next,
      );

      const resourceId = this.validateResourceId(req);
      const newAssignment = await this.service.createDivision(
        resourceId,
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newAssignment,
      } satisfies $DepartmentDivisionAPI.CreateDivision.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getDivisionById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const divisionId = this.validateDivisionId(req);
      const resourceId = this.validateResourceId(req);
      const division = await this.service.getDivisionById(
        divisionId,
        resourceId,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: division,
      } satisfies $DepartmentDivisionAPI.GetDivisionById.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getDivisions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const resourceId = this.validateResourceId(req);
      const divisions = await this.service.getDivisions(resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: divisions,
      } satisfies $DepartmentDivisionAPI.GetDivisions.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateDivision(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentDivisionDtoJoi })(
        req,
        res,
        next,
      );

      const divisionId = this.validateDivisionId(req);
      const resourceId = this.validateResourceId(req);
      const updatedDivision = await this.service.updateDivision(
        divisionId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedDivision,
      } satisfies $DepartmentDivisionAPI.UpdateDivision.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateDivisionLeaderId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentDivisionLeaderIdDtoJoi })(
        req,
        res,
        next,
      );

      const divisionId = this.validateDivisionId(req);
      const resourceId = this.validateResourceId(req);
      const updatedDivision = await this.service.updateDivisionLeaderId(
        divisionId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedDivision,
      } satisfies $DepartmentDivisionAPI.UpdateDivisionLeaderId.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateDivisionCoLeaderId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentDivisionCoLeaderIdDtoJoi })(
        req,
        res,
        next,
      );

      const divisionId = this.validateDivisionId(req);
      const resourceId = this.validateResourceId(req);

      const updatedDivision = await this.service.updateDivisionCoLeaderId(
        divisionId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedDivision,
      } satisfies $DepartmentDivisionAPI.UpdateDivisionCoLeaderId.Response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteDivision(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const divisionId = this.validateDivisionId(req);
      const resourceId = this.validateResourceId(req);

      const result = await this.service.deleteDivision(divisionId, resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: result,
      } satisfies $DepartmentDivisionAPI.DeleteDivision.Response);
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): DepartmentDivisionResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);
    const departmentId: number = Number(req.params.courseId);
    if (isNaNArray([departmentId])) {
      throw new NaNException("departmentId || divisionId");
    }

    return {
      user: {
        id: userId,
        role,
      },
      departmentId,
    };
  }

  private validateDivisionId(req: Request): number {
    const divisionId: number = Number(req.params.divisionId);
    if (isNaN(divisionId)) {
      throw new NaNException("divisionId");
    }

    return divisionId;
  }
}
