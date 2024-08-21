import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import {
  $CourseLessonAPI,
  CourseLessonModel,
  CourseLessonResourceId,
} from "./lesson.type";

export interface ICourseLessonAuthorization {
  authorizeCreateLesson: (user: UserModel, courseId: number) => Promise<void>;
  authorizeUpdateLesson: (user: UserModel, courseId: number) => Promise<void>;
  authorizeDeleteLesson: (user: UserModel, courseId: number) => Promise<void>;
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
  updateLesson: (
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
    user: UserModel,
    id: { resourceId: CourseLessonResourceId },
    dto: $CourseLessonAPI.CreateLesson.Dto,
  ) => Promise<$CourseLessonAPI.CreateLesson.Response["data"]>;
  getLessonById: (id: {
    lessonId: number;
    resourceId: CourseLessonResourceId;
  }) => Promise<$CourseLessonAPI.GetLessonById.Response["data"]>;
  getLessons: (id: {
    resourceId: CourseLessonResourceId;
  }) => Promise<$CourseLessonAPI.GetLessons.Response["data"]>;
  updateLesson: (
    user: UserModel,
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
    dto: $CourseLessonAPI.UpdateLesson.Response["data"],
  ) => Promise<CourseLessonModel>;
  deleteLesson: (
    user: UserModel,
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
  ) => Promise<$CourseLessonAPI.DeleteLesson.Response["data"]>;
}

export interface ICourseLessonRepository<> {
  createLesson: (
    id: {
      courseId: number;
    },
    data: $CourseLessonAPI.CreateLesson.Dto,
  ) => Promise<CourseLessonModel>;
  getLessonById: (id: {
    lessonId: number;
    resourceId?: CourseLessonResourceId;
  }) => Promise<CourseLessonModel | null>;
  getLessonByIdOrThrow: (
    id: {
      lessonId: number;
      resourceId?: CourseLessonResourceId;
    },
    error?: Error,
  ) => Promise<CourseLessonModel>;
  getLessons: (id: { courseId: number }) => Promise<CourseLessonModel[]>;
  updateLesson: (
    id: {
      lessonId: number;
      resourceId?: CourseLessonResourceId;
    },
    data: Partial<CourseLessonModel>,
  ) => Promise<CourseLessonModel>;
  deleteLesson: (id: {
    lessonId: number;
    resourceId: CourseLessonResourceId;
  }) => Promise<{}>;
}
