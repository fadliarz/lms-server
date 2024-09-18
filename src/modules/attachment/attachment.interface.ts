import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import { $CourseLessonAttachmentAPI } from "./attachment.api";
import {
  CourseLessonAttachmentModel,
  CourseLessonAttachmentResourceId,
} from "./attachment.type";

export interface ICourseLessonAttachmentAuthorization {
  authorizeCreateAttachment: (
    user: UserModel,
    courseId: number,
  ) => Promise<void>;
  authorizeReadAttachment: (user: UserModel, courseId: number) => Promise<void>;
  authorizeUpdateAttachment: (
    user: UserModel,
    courseId: number,
  ) => Promise<void>;
  authorizeDeleteAttachment: (
    user: UserModel,
    courseId: number,
  ) => Promise<void>;
}

export interface ICourseLessonAttachmentController {
  createAttachment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getAttachmentById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getAttachments: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateAttachment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteAttachment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseLessonAttachmentService {
  createAttachment: (
    user: UserModel,
    id: {
      resourceId: CourseLessonAttachmentResourceId;
    },
    dto: $CourseLessonAttachmentAPI.CreateAttachment.Dto,
  ) => Promise<$CourseLessonAttachmentAPI.CreateAttachment.Response["data"]>;
  getAttachments: (
    user: UserModel,
    id: {
      resourceId: CourseLessonAttachmentResourceId;
    },
    query: $CourseLessonAttachmentAPI.GetAttachments.Query,
  ) => Promise<$CourseLessonAttachmentAPI.GetAttachments.Response["data"]>;
  getAttachmentById: (
    user: UserModel,
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
  ) => Promise<$CourseLessonAttachmentAPI.GetAttachmentById.Response["data"]>;
  updateAttachment: (
    user: UserModel,
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
    dto: $CourseLessonAttachmentAPI.UpdateAttachment.Dto,
  ) => Promise<$CourseLessonAttachmentAPI.UpdateAttachment.Response["data"]>;
  deleteAttachment: (
    user: UserModel,
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
  ) => Promise<$CourseLessonAttachmentAPI.DeleteAttachment.Response["data"]>;
}

export interface ICourseLessonAttachmentRepository {
  createAttachment: (
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonAttachmentResourceId, "lessonId">;
    },
    data: $CourseLessonAttachmentAPI.CreateAttachment.Dto,
  ) => Promise<CourseLessonAttachmentModel>;
  getAttachments: (
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonAttachmentResourceId, "lessonId">;
    },
    query?: $CourseLessonAttachmentAPI.GetAttachments.Query,
  ) => Promise<CourseLessonAttachmentModel[]>;
  getAttachmentById: (id: {
    attachmentId: number;
    resourceId?: CourseLessonAttachmentResourceId;
  }) => Promise<CourseLessonAttachmentModel | null>;
  getAttachmentByIdOrThrow: (
    id: {
      attachmentId: number;
      resourceId?: CourseLessonAttachmentResourceId;
    },
    error?: Error,
  ) => Promise<CourseLessonAttachmentModel>;
  updateAttachment: (
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
    data: Partial<CourseLessonAttachmentModel>,
  ) => Promise<CourseLessonAttachmentModel>;
  deleteAttachment: (id: {
    attachmentId: number;
    resourceId: CourseLessonAttachmentResourceId;
  }) => Promise<{ id: number }>;
}
