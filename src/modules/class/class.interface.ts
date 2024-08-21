import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import {
  $CourseClassAPI,
  CourseClassModel,
  CourseClassResourceId,
} from "./class.type";

export interface ICourseClassAuthorization {
  authorizeCreateClass: (user: UserModel, courseId: number) => Promise<void>;
  authorizeUpdateClass: (user: UserModel, courseId: number) => Promise<void>;
  authorizeDeleteClass: (user: UserModel, courseId: number) => Promise<void>;
}

export interface ICourseClassController {
  createClass: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getClassById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getClasses: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateClass: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteClass: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseClassService {
  createClass: (
    user: UserModel,
    id: { resourceId: CourseClassResourceId },
    dto: $CourseClassAPI.CreateClass.Dto,
  ) => Promise<$CourseClassAPI.CreateClass.Response["data"]>;
  getClasses: (id: {
    resourceId: CourseClassResourceId;
  }) => Promise<$CourseClassAPI.GetClasses.Response["data"]>;
  getClassById: (id: {
    classId: number;
    resourceId: CourseClassResourceId;
  }) => Promise<$CourseClassAPI.GetClassById.Response["data"]>;
  updateClass: (
    user: UserModel,
    id: {
      classId: number;
      resourceId: CourseClassResourceId;
    },
    dto: $CourseClassAPI.UpdateClass.Dto,
  ) => Promise<$CourseClassAPI.UpdateClass.Response["data"]>;
  deleteClass: (
    user: UserModel,
    id: {
      classId: number;
      resourceId: CourseClassResourceId;
    },
  ) => Promise<$CourseClassAPI.DeleteClass.Response["data"]>;
}

export interface ICourseClassRepository {
  createClass: (
    id: {
      courseId: number;
    },
    data: $CourseClassAPI.CreateClass.Dto,
  ) => Promise<CourseClassModel>;
  getClasses: (id: { courseId: number }) => Promise<CourseClassModel[]>;
  getClassById: (id: {
    classId: number;
    resourceId?: CourseClassResourceId;
  }) => Promise<CourseClassModel | null>;
  getClassByIdOrThrow: (
    id: {
      classId: number;
      resourceId?: CourseClassResourceId;
    },
    error?: Error,
  ) => Promise<CourseClassModel>;
  updateClass: (
    id: {
      classId: number;
      resourceId?: CourseClassResourceId;
    },
    data: Partial<CourseClassModel>,
  ) => Promise<CourseClassModel>;
  deleteClass: (id: {
    classId: number;
    resourceId: CourseClassResourceId;
  }) => Promise<{}>;
}