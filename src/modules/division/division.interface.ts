import { UserModel } from "../user/user.type";
import {
  $DepartmentDivisionAPI,
  DepartmentDivisionModel,
  DepartmentDivisionResourceId,
} from "./division.type";
import { DepartmentModel } from "../department/department.type";
import { NextFunction, Request, Response } from "express";

export interface IDepartmentDivisionAuthorization {
  authorizeCreateDivision: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
  authorizeUpdateDivision: (
    user: UserModel,
    department: DepartmentModel,
    division: DepartmentDivisionModel,
  ) => void;
  authorizeUpdateDivisionLeaderId: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
  authorizeUpdateDivisionCoLeaderId: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
  authorizeDeleteDivision: (
    user: UserModel,
    department: DepartmentModel,
  ) => void;
}

export interface IDepartmentDivisionController {
  createDivision: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getDivisions: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getDivisionById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateDivision: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateDivisionLeaderId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateDivisionCoLeaderId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteDivision: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IDepartmentDivisionService {
  createDivision: (
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.CreateDivision.Dto,
  ) => Promise<$DepartmentDivisionAPI.CreateDivision.Response["data"]>;
  getDivisions: (
    resourceId: DepartmentDivisionResourceId,
  ) => Promise<$DepartmentDivisionAPI.GetDivisions.Response["data"]>;
  getDivisionById: (
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
  ) => Promise<$DepartmentDivisionAPI.GetDivisionById.Response["data"]>;
  updateDivision: (
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.UpdateDivision.Dto,
  ) => Promise<$DepartmentDivisionAPI.UpdateDivision.Response["data"]>;
  updateDivisionLeaderId: (
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.UpdateDivisionLeaderId.Dto,
  ) => Promise<$DepartmentDivisionAPI.UpdateDivisionLeaderId.Response["data"]>;
  updateDivisionCoLeaderId: (
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.UpdateDivisionCoLeaderId.Dto,
  ) => Promise<
    $DepartmentDivisionAPI.UpdateDivisionCoLeaderId.Response["data"]
  >;
  deleteDivision: (
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
  ) => Promise<$DepartmentDivisionAPI.DeleteDivision.Response["data"]>;
}

export interface IDepartmentDivisionRepository {
  createDivision: (
    data: {
      departmentId: number;
    } & $DepartmentDivisionAPI.CreateDivision.Dto,
  ) => Promise<DepartmentDivisionModel>;
  getDivisions: (departmentId: number) => Promise<DepartmentDivisionModel[]>;
  getAllExtendedDivisions: () => Promise<
    (DepartmentDivisionModel & { department: { id: number; title: string } })[]
  >;
  getDivisionById: (
    divisionId: number,
  ) => Promise<DepartmentDivisionModel | null>;
  getDivisionByIdOrThrow: (
    divisionId: number,
    error?: Error,
  ) => Promise<DepartmentDivisionModel>;
  updateDivision: (
    divisionId: number,
    data: Partial<DepartmentDivisionModel>,
  ) => Promise<DepartmentDivisionModel>;
  deleteDivision: (divisionId: number) => Promise<{}>;
}
