import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.type";
import {
  CourseClassAssignmentModel,
  CourseClassAssignmentResourceId,
} from "./assignment.type";
import { $CourseClassAssignmentAPI } from "./assignment.api";

export interface ICourseClassAssignmentAuthorization {
  authorizeCreateAssignment: (
    user: UserModel,
    courseId: number,
  ) => Promise<void>;
  authorizeReadAssignment: (user: UserModel, courseId: number) => Promise<void>;
  authorizeUpdateAssignment: (
    user: UserModel,
    courseId: number,
  ) => Promise<void>;
  authorizeDeleteAssignment: (
    user: UserModel,
    courseId: number,
  ) => Promise<void>;
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
    user: UserModel,
    id: { resourceId: CourseClassAssignmentResourceId },
    dto: $CourseClassAssignmentAPI.CreateAssignment.Dto,
  ) => Promise<$CourseClassAssignmentAPI.CreateAssignment.Response["data"]>;
  getAssignments: (
    user: UserModel,
    id: {
      resourceId: CourseClassAssignmentResourceId;
    },
    query: $CourseClassAssignmentAPI.GetAssignments.Query,
  ) => Promise<$CourseClassAssignmentAPI.GetAssignments.Response["data"]>;
  getAssignmentById: (
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
  ) => Promise<$CourseClassAssignmentAPI.GetAssignmentById.Response["data"]>;
  updateAssignment: (
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
    dto: $CourseClassAssignmentAPI.UpdateAssignment.Dto,
  ) => Promise<$CourseClassAssignmentAPI.UpdateAssignment.Response["data"]>;
  deleteAssignment: (
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: CourseClassAssignmentResourceId;
    },
  ) => Promise<$CourseClassAssignmentAPI.DeleteAssignment.Response["data"]>;
}

export interface ICourseClassAssignmentRepository {
  createAssignment: (
    id: {
      classId: number;
      resourceId?: Omit<CourseClassAssignmentResourceId, "classId">;
    },
    data: $CourseClassAssignmentAPI.CreateAssignment.Dto,
  ) => Promise<CourseClassAssignmentModel>;
  getAssignments: (
    id: {
      classId: number;
      resourceId?: Omit<CourseClassAssignmentResourceId, "classId">;
    },
    query?: $CourseClassAssignmentAPI.GetAssignments.Query,
  ) => Promise<CourseClassAssignmentModel[]>;
  getAssignmentById: (id: {
    assignmentId: number;
    resourceId?: CourseClassAssignmentResourceId;
  }) => Promise<CourseClassAssignmentModel | null>;
  getAssignmentByIdOrThrow: (
    id: {
      assignmentId: number;
      resourceId?: CourseClassAssignmentResourceId;
    },
    error?: Error,
  ) => Promise<CourseClassAssignmentModel>;
  updateAssignment: (
    id: {
      assignmentId: number;
      resourceId?: CourseClassAssignmentResourceId;
    },
    data: Partial<CourseClassAssignmentModel>,
  ) => Promise<CourseClassAssignmentModel>;
  deleteAssignment: (id: {
    assignmentId: number;
    resourceId: CourseClassAssignmentResourceId;
  }) => Promise<{}>;
}
