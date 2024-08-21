import {
  $DepartmentProgramEnrollmentAPI,
  DepartmentProgramEnrollmentModel,
  DepartmentProgramEnrollmentResourceId,
} from "./enrollment.type";
import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";

export interface IDepartmentProgramEnrollmentAuthorization {
  authorizeCreateEnrollment: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
  authorizeDeleteEnrollment: (
    user: UserModel,
    enrollment: DepartmentProgramEnrollmentModel,
  ) => Promise<void>;
}

export interface IDepartmentProgramEnrollmentController {
  createEnrollment: (
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

export interface IDepartmentProgramEnrollmentService {
  createEnrollment: (
    user: UserModel,
    id: { resourceId: DepartmentProgramEnrollmentResourceId },
    dto: $DepartmentProgramEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<
    $DepartmentProgramEnrollmentAPI.CreateEnrollment.Response["data"]
  >;
  deleteEnrollment: (
    user: UserModel,
    id: {
      enrollmentId: number;
      resourceId: DepartmentProgramEnrollmentResourceId;
    },
  ) => Promise<
    $DepartmentProgramEnrollmentAPI.DeleteEnrollment.Response["data"]
  >;
}

export interface IDepartmentProgramEnrollmentRepository {
  createEnrollment: (
    id: {
      programId: number;
      resourceId?: Omit<DepartmentProgramEnrollmentResourceId, "programId">;
    },
    data: $DepartmentProgramEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<DepartmentProgramEnrollmentModel>;
  getEnrollmentById: (id: {
    enrollmentId: number;
    resourceId?: DepartmentProgramEnrollmentResourceId;
  }) => Promise<DepartmentProgramEnrollmentModel | null>;
  getEnrollmentByIdOrThrow: (
    id: {
      enrollmentId: number;
      resourceId?: DepartmentProgramEnrollmentResourceId;
    },
    error?: Error,
  ) => Promise<DepartmentProgramEnrollmentModel>;
  deleteEnrollment: (id: {
    enrollmentId: number;
    resourceId?: DepartmentProgramEnrollmentResourceId;
  }) => Promise<{}>;
}
