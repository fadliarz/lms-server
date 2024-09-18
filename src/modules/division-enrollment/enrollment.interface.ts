import { UserModel } from "../user/user.type";
import {
  DepartmentDivisionEnrollmentModel,
  DepartmentDivisionEnrollmentResourceId,
} from "./enrollment.type";
import { NextFunction, Request, Response } from "express";
import { $DepartmentDivisionEnrollmentAPI } from "./enrollment.api";

export interface IDepartmentDivisionEnrollmentAuthorization {
  authorizeCreateEnrollment: (
    user: UserModel,
    divisionId: number,
  ) => Promise<void>;
  authorizeDeleteEnrollment: (
    user: UserModel,
    divisionId: number,
  ) => Promise<void>;
}

export interface IDepartmentDivisionEnrollmentController {
  createEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getEnrollments: (
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

export interface IDepartmentDivisionEnrollmentService {
  createEnrollment: (
    user: UserModel,
    id: { resourceId: DepartmentDivisionEnrollmentResourceId },
    dto: $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<
    $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Response["data"]
  >;
  getEnrollments: (id: {
    resourceId: DepartmentDivisionEnrollmentResourceId;
  }) => Promise<
    $DepartmentDivisionEnrollmentAPI.GetEnrollments.Response["data"]
  >;
  deleteEnrollment: (
    user: UserModel,
    id: {
      enrollmentId: number;
      resourceId: DepartmentDivisionEnrollmentResourceId;
    },
  ) => Promise<
    $DepartmentDivisionEnrollmentAPI.DeleteEnrollment.Response["data"]
  >;
}

export interface IDepartmentDivisionEnrollmentRepository {
  createEnrollment: (
    id: {
      divisionId: number;
      resourceId?: Omit<DepartmentDivisionEnrollmentResourceId, "divisionId">;
    },
    dto: $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<DepartmentDivisionEnrollmentModel>;
  getEnrollments: (id: {
    divisionId: number;
    resourceId?: Omit<DepartmentDivisionEnrollmentResourceId, "divisionId">;
  }) => Promise<DepartmentDivisionEnrollmentModel[]>;
  getEnrollmentById: (id: {
    enrollmentId: number;
    resourceId?: DepartmentDivisionEnrollmentResourceId;
  }) => Promise<DepartmentDivisionEnrollmentModel | null>;
  getEnrollmentByIdOrThrow: (
    id: {
      enrollmentId: number;
      resourceId?: DepartmentDivisionEnrollmentResourceId;
    },
    error?: Error,
  ) => Promise<DepartmentDivisionEnrollmentModel>;
  deleteEnrollment: (id: {
    enrollmentId: number;
    resourceId?: DepartmentDivisionEnrollmentResourceId;
  }) => Promise<{ id: number }>;
}
