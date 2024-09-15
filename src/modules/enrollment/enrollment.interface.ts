import { UserModel } from "../user/user.type";
import {
  CourseEnrollmentModel,
  CourseEnrollmentResourceId,
} from "./enrollment.type";
import { NextFunction, Request, Response } from "express";
import { $CourseEnrollmentAPI } from "./enrollment.api";

export interface ICourseEnrollmentAuthorization {
  authorizeCreateEnrollment: (
    user: UserModel,
    dto: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<void>;
  authorizeUpdateEnrollmentRole: (user: UserModel) => Promise<void>;
  authorizeDeleteEnrollment: (
    user: UserModel,
    enrollmentId: number,
  ) => Promise<void>;
}

export interface ICourseEnrollmentController {
  createEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateEnrollment: (
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

export interface ICourseEnrollmentService {
  createEnrollment: (
    resourceId: CourseEnrollmentResourceId,
    dto: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<$CourseEnrollmentAPI.CreateEnrollment.Response["data"]>;
  updateEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: $CourseEnrollmentAPI.UpdateEnrollment.Dto,
  ) => Promise<$CourseEnrollmentAPI.UpdateEnrollment.Response["data"]>;
  deleteEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ) => Promise<$CourseEnrollmentAPI.DeleteEnrollment.Response["data"]>;
}

export interface ICourseEnrollmentRepository {
  createEnrollment: (
    id: CourseEnrollmentResourceId["params"],
    data: $CourseEnrollmentAPI.CreateEnrollment.Dto,
  ) => Promise<CourseEnrollmentModel>;
  getEnrollmentById: (id: number) => Promise<CourseEnrollmentModel | null>;
  getEnrollmentByUserIdAndCourseId: (id: {
    userId: number;
    courseId: number;
  }) => Promise<CourseEnrollmentModel | null>;
  updateEnrollment: (
    id: {
      enrollmentId: number;
      resourceId?: CourseEnrollmentResourceId["params"];
    },
    data: Partial<CourseEnrollmentModel>,
  ) => Promise<CourseEnrollmentModel>;
  deleteEnrollment: (id: {
    enrollmentId: number;
    resourceId?: CourseEnrollmentResourceId["params"];
  }) => Promise<{}>;
}
