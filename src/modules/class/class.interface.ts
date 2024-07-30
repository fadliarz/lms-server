import { UserModel } from "../user/user.type";
import { CourseModel } from "../course/course.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { NextFunction, Request, Response } from "express";
import {
  CourseClassModel,
  CourseClassResourceId,
  CreateCourseClassDto,
  UpdateCourseClassDto,
} from "./class.type";
import { UnauthenticatedResourceId } from "../../common/types";

export interface ICourseClassAuthorization {
  authorizeCreateClass: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeUpdateClass: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteClass: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
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
    resourceId: CourseClassResourceId,
    dto: CreateCourseClassDto,
  ) => Promise<CourseClassModel>;
  getClassById: (
    classId: number,
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ) => Promise<CourseClassModel>;
  getClasses: (
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ) => Promise<CourseClassModel[]>;
  updateClass: (
    classId: number,
    resourceId: CourseClassResourceId,
    dto: UpdateCourseClassDto,
  ) => Promise<CourseClassModel>;
  deleteClass: (
    classId: number,
    resourceId: CourseClassResourceId,
  ) => Promise<{}>;
}

export interface ICourseClassRepository {
  createClass: (
    resourceId: CourseClassResourceId,
    dto: CreateCourseClassDto,
  ) => Promise<CourseClassModel>;
  getClassById: (
    classId: number,
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ) => Promise<CourseClassModel | null>;
  getClassByIdOrThrow: (
    classId: number,
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
    error?: Error,
  ) => Promise<CourseClassModel>;
  getClasses: (
    resourceId: UnauthenticatedResourceId<CourseClassResourceId>,
  ) => Promise<CourseClassModel[]>;
  updateClass: (
    classId: number,
    resourceId: CourseClassResourceId,
    dto: Partial<CourseClassModel>,
  ) => Promise<CourseClassModel>;
  deleteClass: (
    classId: number,
    resourceId: CourseClassResourceId,
  ) => Promise<{}>;
}
