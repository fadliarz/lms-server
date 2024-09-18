import { UserModel } from "../user/user.type";
import {
  DepartmentProgramModel,
  DepartmentProgramResourceId,
} from "./program.type";
import { NextFunction, Request, Response } from "express";
import { $DepartmentProgramAPI } from "./program.api";

export interface IDepartmentProgramAuthorization {
  authorizeCreateProgram: (
    user: UserModel,
    departmentId: number,
  ) => Promise<void>;
  authorizeUpdateProgram: (
    user: UserModel,
    departmentId: number,
  ) => Promise<void>;
  authorizeDeleteProgram: (
    user: UserModel,
    departmentId: number,
  ) => Promise<void>;
}

export interface IDepartmentProgramController {
  createProgram: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getAllPrograms: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getPrograms: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getProgramById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateProgram: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteProgram: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IDepartmentProgramService {
  createProgram: (
    user: UserModel,
    id: { resourceId: DepartmentProgramResourceId },
    dto: $DepartmentProgramAPI.CreateProgram.Dto,
  ) => Promise<$DepartmentProgramAPI.CreateProgram.Response["data"]>;
  getAllPrograms: () => Promise<
    $DepartmentProgramAPI.GetAllPrograms.Response["data"]
  >;
  getPrograms: (id: {
    resourceId: DepartmentProgramResourceId;
  }) => Promise<$DepartmentProgramAPI.GetPrograms.Response["data"]>;
  getProgramById: (id: {
    programId: number;
    resourceId: DepartmentProgramResourceId;
  }) => Promise<$DepartmentProgramAPI.GetProgramById.Response["data"]>;
  updateProgram: (
    user: UserModel,
    id: {
      programId: number;
      resourceId: DepartmentProgramResourceId;
    },
    dto: $DepartmentProgramAPI.UpdateProgram.Dto,
  ) => Promise<$DepartmentProgramAPI.UpdateProgram.Response["data"]>;
  deleteProgram: (
    user: UserModel,
    id: {
      programId: number;
      resourceId: DepartmentProgramResourceId;
    },
  ) => Promise<$DepartmentProgramAPI.DeleteProgram.Response["data"]>;
}

export interface IDepartmentProgramRepository {
  createProgram: (
    id: {
      departmentId: number;
    },
    data: $DepartmentProgramAPI.CreateProgram.Dto,
  ) => Promise<DepartmentProgramModel>;
  getAllPrograms: () => Promise<
    $DepartmentProgramAPI.GetAllPrograms.Response["data"]
  >;
  getPrograms: (id: {
    departmentId: number;
  }) => Promise<DepartmentProgramModel[]>;
  getProgramById: (id: {
    programId: number;
    resourceId?: DepartmentProgramResourceId;
  }) => Promise<DepartmentProgramModel | null>;
  getProgramByIdOrThrow: (
    id: { programId: number; resourceId?: DepartmentProgramResourceId },
    error?: Error,
  ) => Promise<DepartmentProgramModel>;
  updateProgram: (
    id: { programId: number; resourceId?: DepartmentProgramResourceId },
    data: Partial<DepartmentProgramModel>,
  ) => Promise<DepartmentProgramModel>;
  deleteProgram: (id: {
    programId: number;
    resourceId?: DepartmentProgramResourceId;
  }) => Promise<{ id: number }>;
}
