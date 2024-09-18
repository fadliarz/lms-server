import {
  CourseClassAssignmentCompletionModel,
  CourseClassAssignmentCompletionResourceId,
} from "./completion.type";
import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { $CourseClassAssignmentCompletionAPI } from "./completion.api";

export interface ICourseClassAssignmentCompletionAuthorization {
  authorizeCreateCompletion: (
    user: UserModel,
    id: { courseId: number; targetUserId: number },
  ) => Promise<void>;
  authorizeUpdateCompletion: (
    user: UserModel,
    completionId: number,
  ) => Promise<void>;
  authorizeDeleteCompletion: (
    user: UserModel,
    completionId: number,
  ) => Promise<void>;
}

export interface ICourseClassAssignmentCompletionController {
  createCompletion: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCompletion: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteCompletion: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseClassAssignmentCompletionService {
  createCompletion: (
    user: UserModel,
    id: {
      resourceId: CourseClassAssignmentCompletionResourceId;
    },
    dto: $CourseClassAssignmentCompletionAPI.CreateCompletion.Dto,
  ) => Promise<
    $CourseClassAssignmentCompletionAPI.CreateCompletion.Response["data"]
  >;
  updateCompletion: (
    user: UserModel,
    id: {
      completionId: number;
      resourceId: CourseClassAssignmentCompletionResourceId;
    },
    dto: $CourseClassAssignmentCompletionAPI.UpdateCompletion.Dto,
  ) => Promise<
    $CourseClassAssignmentCompletionAPI.DeleteCompletion.Response["data"]
  >;
  deleteCompletion: (
    user: UserModel,
    id: {
      completionId: number;
      resourceId: CourseClassAssignmentCompletionResourceId;
    },
  ) => Promise<
    $CourseClassAssignmentCompletionAPI.DeleteCompletion.Response["data"]
  >;
}

export interface ICourseClassAssignmentCompletionRepository {
  createCompletion: (
    id: {
      assignmentId: number;
      resourceId?: Omit<
        CourseClassAssignmentCompletionResourceId,
        "assignmentId"
      >;
    },
    data: $CourseClassAssignmentCompletionAPI.CreateCompletion.Dto,
  ) => Promise<CourseClassAssignmentCompletionModel>;
  getCompletionById: (id: {
    completionId: number;
    resourceId?: CourseClassAssignmentCompletionResourceId;
  }) => Promise<CourseClassAssignmentCompletionModel | null>;
  updateCompletion: (
    id: {
      completionId: number;
      resourceId?: CourseClassAssignmentCompletionResourceId;
    },
    dto: Partial<CourseClassAssignmentCompletionModel>,
  ) => Promise<CourseClassAssignmentCompletionModel>;
  deleteCompletion: (id: {
    completionId: number;
    resourceId?: CourseClassAssignmentCompletionResourceId;
  }) => Promise<{ id: number }>;
}
