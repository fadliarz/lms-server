import { UserModel } from "../user/user.type";
import { CourseModel, UserRoleModel } from "../course/course.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { NextFunction, Request, Response } from "express";

export const CourseClassAssignmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_ASSIGNMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_ASSIGNMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_ASSIGNMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_ASSIGNMENT_AUTHORIZATION"),
};

export enum courseClassAssignmentUrls {
  root = "/courses/:courseId/classes/:classId/assignments",
  assignment = courseClassAssignmentUrls.root + "/:assignmentId",
}

export enum CourseClassAssignmentErrorMessage {
  ASSIGNMENT_DOES_NOT_EXIST = "assignment doesn't exist!",
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

export type CourseClassAssignmentModel = {
  id: number;
  title: string;
  submission: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  classId: number;
};
export type ValuableCourseClassAssignmentModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseClassAssignmentModel>;

/**
 *
 *
 * Dto
 *
 *
 */

export type CreateCourseClassAssignmentDto = {
  title: string;
  submission: string;
  deadline: Date;
};

export type UpdateCourseClassAssignmentDto =
  Partial<CreateCourseClassAssignmentDto>;

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseClassAssignmentResourceId = {
  user: { id: number; role: UserRoleModel };
  courseId: number;
  classId: number;
};
