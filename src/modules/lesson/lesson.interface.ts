import { UserModel } from "../user/user.type";
import { CourseModel } from "../course/course.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { NextFunction, Request, Response } from "express";
import {
  CourseLessonModel,
  CourseLessonResourceId,
  CreateCourseLessonDto,
  UpdateBasicCourseLessonDto,
} from "./lesson.type";
import { UnauthenticatedResourceId } from "../../common/types";

export interface ICourseLessonAuthorization {
  authorizeCreateLesson: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeUpdateLesson: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteLesson: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
}

export interface ICourseLessonController {
  createLesson: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getLessonById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getLessons: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateBasicLesson: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteLesson: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseLessonService {
  createLesson: (
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  getLessonById: (
    lessonId: number,
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ) => Promise<CourseLessonModel>;
  getLessons: (
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ) => Promise<CourseLessonModel[]>;
  updateBasicLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateBasicCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  deleteLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<{}>;
  validateRelationBetweenResources: (
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
    error?: Error,
  ) => Promise<CourseLessonModel | null>;
}

export interface ICourseLessonRepository {
  createLesson: (
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ) => Promise<CourseLessonModel>;
  getLessonById: (
    lessonId: number,
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ) => Promise<CourseLessonModel | null>;
  getLessonByIdOrThrow: (
    lessonId: number,
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
    error?: Error,
  ) => Promise<CourseLessonModel>;
  getLessons: (
    resourceId: UnauthenticatedResourceId<CourseLessonResourceId>,
  ) => Promise<CourseLessonModel[]>;
  updateLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: Partial<CourseLessonModel>,
  ) => Promise<CourseLessonModel>;
  deleteLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<{}>;
}
