import { UserModel } from "../user/user.type";
import { CourseModel } from "../course/course.type";
import {
  CourseEnrollmentModel,
  CourseEnrollmentResourceId,
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentRoleDto,
} from "./enrollment.type";
import { CourseEnrollment } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export interface ICourseEnrollmentAuthorization {
  authorizeCreateEnrollment: (
    user: UserModel,
    course: CourseModel,
    dto: CreateCourseEnrollmentDto,
  ) => void;
  authorizeUpdateEnrollmentRole: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollment,
  ) => void;
  authorizeDeleteEnrollment: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel,
  ) => void;
}

export interface ICourseEnrollmentController {
  createEnrollment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateEnrollmentRole: (
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
    dto: CreateCourseEnrollmentDto,
  ) => Promise<CourseEnrollmentModel>;
  updateEnrollmentRole: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ) => Promise<CourseEnrollmentModel>;
  deleteEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ) => Promise<{}>;
}

export interface ICourseEnrollmentRepository {
  createEnrollment: (
    resourceId: CourseEnrollmentResourceId,
    dto: CreateCourseEnrollmentDto,
  ) => Promise<CourseEnrollment>;
  updateEnrollmentRole: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
    dto: UpdateCourseEnrollmentRoleDto,
  ) => Promise<CourseEnrollment>;
  deleteEnrollment: (
    enrollmentId: number,
    resourceId: CourseEnrollmentResourceId,
  ) => Promise<{}>;
}
