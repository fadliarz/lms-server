import { UserModel } from "../user/user.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { CourseModel, UserRoleModel } from "../course/course.type";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  UnauthenticatedResourceId,
} from "../../common/types";
import { CourseClass } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const CourseClassDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_AUTHORIZATION"),
};

export enum courseClassUrls {
  root = "/courses/:courseId/classes",
  class = courseClassUrls.root + "/:classId",
}

export enum CourseClassErrorMessage {
  CLASS_DOES_NOT_EXIST = "class doesn't exist!",
}

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

export type CourseClassModel = CourseClass;
export type ValuableCourseClassModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseClassModel>;

/**
 *
 *
 * Dto
 *
 *
 */

export type CreateCourseClassDto = {
  title: string;
};

export type UpdateCourseClassDto = {
  title?: string;
};

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseClassResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
  courseId: number;
};
