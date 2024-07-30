import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.type";
import { CourseModel } from "../course/course.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import {
  CourseClassAssignmentModel,
  CourseClassAssignmentResourceId,
  CreateCourseClassAssignmentDto,
  UpdateCourseClassAssignmentDto,
} from "./assignment.type";

export interface ICourseClassAssignmentAuthorization {
  authorizeCreateAssignment: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeReadAssignment: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeUpdateAssignment: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteAssignment: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
}

export interface ICourseClassAssignmentController {
  createAssignment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getAssignmentById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getAssignments: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateAssignment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteAssignment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseClassAssignmentService {
  createAssignment: (
    resourceId: CourseClassAssignmentResourceId,
    dto: CreateCourseClassAssignmentDto,
  ) => Promise<CourseClassAssignmentModel>;
  getAssignmentById: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ) => Promise<CourseClassAssignmentModel>;
  getAssignments: (
    resourceId: CourseClassAssignmentResourceId,
  ) => Promise<CourseClassAssignmentModel[]>;
  updateAssignment: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
    dto: UpdateCourseClassAssignmentDto,
  ) => Promise<CourseClassAssignmentModel>;
  deleteAssignment: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ) => Promise<{}>;
}

export interface ICourseClassAssignmentRepository {
  createAssignment: (
    resourceId: CourseClassAssignmentResourceId,
    dto: CreateCourseClassAssignmentDto,
  ) => Promise<CourseClassAssignmentModel>;
  getAssignmentById: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ) => Promise<CourseClassAssignmentModel | null>;
  getAssignmentByIdOrThrow: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
    error?: Error,
  ) => Promise<CourseClassAssignmentModel>;
  getAssignments: (
    resourceId: CourseClassAssignmentResourceId,
  ) => Promise<CourseClassAssignmentModel[]>;
  updateAssignment: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
    dto: Partial<CourseClassAssignmentModel>,
  ) => Promise<CourseClassAssignmentModel>;
  deleteAssignment: (
    assignmentId: number,
    resourceId: CourseClassAssignmentResourceId,
  ) => Promise<{}>;
}
