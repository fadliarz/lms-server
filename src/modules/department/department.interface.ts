import { DepartmentModel, DepartmentResourceId } from "./department.type";
import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { $DepartmentAPI } from "./department.api";

export interface IDepartmentAuthorization {
  authorizeCreateDepartment: (user: UserModel) => void;
  authorizeUpdateDepartment: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
  authorizeUpdateDepartmentLeaderId: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
  authorizeUpdateDepartmentCoLeaderId: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
  authorizeDeleteDepartment: (user: UserModel) => void;
}

export interface IDepartmentController {
  createDepartment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getDepartmentById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getDepartments: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateDepartment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateDepartmentLeaderId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateDepartmentCoLeaderId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteDepartment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IDepartmentService {
  createDepartment: (
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.CreateDepartment.Dto,
  ) => Promise<$DepartmentAPI.CreateDepartment.Response["data"]>;
  getDepartments: () => Promise<$DepartmentAPI.GetDepartments.Response["data"]>;
  getDepartmentById: (
    departmentId: number,
  ) => Promise<$DepartmentAPI.GetDepartmentById.Response["data"]>;
  updateDepartment: (
    departmentId: number,
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.UpdateDepartment.Dto,
  ) => Promise<$DepartmentAPI.UpdateDepartment.Response["data"]>;
  updateDepartmentLeaderId: (
    departmentId: number,
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.UpdateDepartmentLeaderId.Dto,
  ) => Promise<$DepartmentAPI.UpdateDepartmentLeaderId.Response["data"]>;
  updateDepartmentCoLeaderId: (
    departmentId: number,
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.UpdateDepartmentCoLeaderId.Dto,
  ) => Promise<$DepartmentAPI.UpdateDepartmentCoLeaderId.Response["data"]>;
  deleteDepartment: (
    departmentId: number,
    resourceId: DepartmentResourceId,
  ) => Promise<$DepartmentAPI.DeleteDepartment.Response["data"]>;
}

export interface IDepartmentRepository {
  createDepartment: (
    data: $DepartmentAPI.CreateDepartment.Dto,
  ) => Promise<DepartmentModel>;
  getDepartments: () => Promise<DepartmentModel[]>;
  getDepartmentById: (departmentId: number) => Promise<DepartmentModel | null>;
  getDepartmentByIdOrThrow: (
    departmentId: number,
    error?: Error,
  ) => Promise<DepartmentModel>;
  updateDepartment: (
    departmentId: number,
    dto: Partial<DepartmentModel>,
  ) => Promise<DepartmentModel>;
  deleteDepartment: (departmentId: number) => Promise<{ id: number }>;
}
