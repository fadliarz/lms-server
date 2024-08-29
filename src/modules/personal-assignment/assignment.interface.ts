import { UserModel } from "../user/user.type";
import {
  PersonalAssignmentModel,
  PersonalAssignmentResourceId,
} from "./assignment.type";
import { NextFunction, Request, Response } from "express";
import { $PersonalAssignmentAPI } from "./assignment.api";

export interface IPersonalAssignmentAuthorization {
  authorizeCreateAssignment: (user: UserModel, targetUserId: number) => void;
  authorizeUpdateAssignment: (
    user: UserModel,
    assignmentId: number,
  ) => Promise<void>;
  authorizeDeleteAssignment: (
    user: UserModel,
    assignmentId: number,
  ) => Promise<void>;
}

export interface IPersonalAssignmentController {
  createAssignment: (
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

export interface IPersonalAssignmentService {
  createAssignment: (
    user: UserModel,
    id: {
      resourceId: PersonalAssignmentResourceId;
    },
    dto: $PersonalAssignmentAPI.CreateAssignment.Dto,
  ) => Promise<$PersonalAssignmentAPI.CreateAssignment.Response["data"]>;
  updateAssignment: (
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: PersonalAssignmentResourceId;
    },
    dto: $PersonalAssignmentAPI.UpdateAssignment.Dto,
  ) => Promise<$PersonalAssignmentAPI.UpdateAssignment.Response["data"]>;
  deleteAssignment: (
    user: UserModel,
    id: {
      assignmentId: number;
      resourceId: PersonalAssignmentResourceId;
    },
  ) => Promise<$PersonalAssignmentAPI.DeleteAssignment.Response["data"]>;
}

export interface IPersonalAssignmentRepository {
  createAssignment: (
    id: {
      userId: number;
    },
    data: $PersonalAssignmentAPI.CreateAssignment.Dto,
  ) => Promise<PersonalAssignmentModel>;
  getAssignments: (id: {
    userId: number;
  }) => Promise<PersonalAssignmentModel[]>;
  getAssignmentById: (id: {
    assignmentId: number;
    resourceId?: PersonalAssignmentResourceId;
  }) => Promise<PersonalAssignmentModel | null>;
  getAssignmentByIdOrThrow: (
    id: {
      assignmentId: number;
      resourceId?: PersonalAssignmentResourceId;
    },
    error?: Error,
  ) => Promise<PersonalAssignmentModel>;
  updateAssignment: (
    id: {
      assignmentId: number;
      resourceId?: PersonalAssignmentResourceId;
    },
    data: Partial<PersonalAssignmentModel>,
  ) => Promise<PersonalAssignmentModel>;
  deleteAssignment: (id: {
    assignmentId: number;
    resourceId?: PersonalAssignmentResourceId;
  }) => Promise<{}>;
}
