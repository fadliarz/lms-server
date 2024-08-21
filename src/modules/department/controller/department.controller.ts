import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  IDepartmentController,
  IDepartmentService,
} from "../department.interface";
import {
  $DepartmentAPI,
  DepartmentDITypes,
  DepartmentResourceId,
} from "../department.type";
import {
  CreateDepartmentDtoJoi,
  UpdateDepartmentCoLeaderIdDtoJoi,
  UpdateDepartmentDtoJoi,
  UpdateDepartmentLeaderIdDtoJoi,
} from "./department.joi";

@injectable()
export default class DepartmentController implements IDepartmentController {
  @inject(DepartmentDITypes.SERVICE)
  private readonly service: IDepartmentService;

  public async createDepartment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateDepartmentDtoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newDepartment = await this.service.createDepartment(
        resourceId,
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newDepartment,
      } satisfies $DepartmentAPI.CreateDepartment.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getDepartments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const departments = await this.service.getDepartments();

      return res.status(StatusCode.SUCCESS).json({
        data: departments,
      } satisfies $DepartmentAPI.GetDepartments.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getDepartmentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const departmentId = this.validateDepartmentId(req);
      const department = await this.service.getDepartmentById(departmentId);

      return res.status(StatusCode.SUCCESS).json({
        data: department,
      } satisfies $DepartmentAPI.GetDepartmentById.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateDepartment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentDtoJoi })(req, res, next);

      const departmentId = this.validateDepartmentId(req);
      const resourceId = this.validateResourceId(req);
      const updatedDepartment = await this.service.updateDepartment(
        departmentId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedDepartment,
      } satisfies $DepartmentAPI.UpdateDepartment.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateDepartmentLeaderId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentLeaderIdDtoJoi })(
        req,
        res,
        next,
      );

      const departmentId = this.validateDepartmentId(req);
      const resourceId = this.validateResourceId(req);
      const updatedDepartment = await this.service.updateDepartmentLeaderId(
        departmentId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedDepartment,
      } satisfies $DepartmentAPI.UpdateDepartmentLeaderId.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateDepartmentCoLeaderId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateDepartmentCoLeaderIdDtoJoi })(
        req,
        res,
        next,
      );

      const departmentId = this.validateDepartmentId(req);
      const resourceId = this.validateResourceId(req);
      const updatedDepartment = await this.service.updateDepartmentCoLeaderId(
        departmentId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedDepartment,
      } satisfies $DepartmentAPI.UpdateDepartmentCoLeaderId.Response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteDepartment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const departmentId = this.validateDepartmentId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteDepartment(departmentId, resourceId);

      res
        .status(StatusCode.SUCCESS)
        .json({ data: {} } satisfies $DepartmentAPI.DeleteDepartment.Response);
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): DepartmentResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);

    return {
      user: { id: userId, role },
    };
  }

  private validateDepartmentId(req: Request): number {
    const departmentId: number = Number(req.params.departmentId);
    if (isNaN(departmentId)) {
      throw new NaNException("departmentId");
    }

    return departmentId;
  }
}
