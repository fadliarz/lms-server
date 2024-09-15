import { UserModel } from "../user/user.type";
import { NextFunction, Request, Response } from "express";
import {
  CourseLessonVideoModel,
  CourseLessonVideoResourceId,
} from "./video.type";
import { $CourseLessonVideoAPI } from "./video.api";

export interface ICourseLessonVideoAuthorization {
  authorizeCreateVideo: (user: UserModel, courseId: number) => Promise<void>;
  authorizeReadVideo: (user: UserModel, courseId: number) => Promise<void>;
  authorizeUpdateVideo: (user: UserModel, courseId: number) => Promise<void>;
  authorizeDeleteVideo: (user: UserModel, courseId: number) => Promise<void>;
}

export interface ICourseLessonVideoController {
  createVideo: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getVideoById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getVideos: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateVideo: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateVideoSource: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteVideo: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface ICourseLessonVideoService {
  createVideo: (
    user: UserModel,
    id: {
      resourceId: CourseLessonVideoResourceId;
    },
    dto: $CourseLessonVideoAPI.CreateVideo.Dto,
  ) => Promise<$CourseLessonVideoAPI.CreateVideo.Response["data"]>;
  getVideos: (
    user: UserModel,
    id: {
      resourceId: CourseLessonVideoResourceId;
    },
    query: $CourseLessonVideoAPI.GetVideos.Query,
  ) => Promise<$CourseLessonVideoAPI.GetVideos.Response["data"]>;
  getVideoById: (
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
  ) => Promise<$CourseLessonVideoAPI.GetVideoById.Response["data"]>;
  updateVideo: (
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    dto: $CourseLessonVideoAPI.UpdateVideo.Dto,
  ) => Promise<$CourseLessonVideoAPI.UpdateVideo.Response["data"]>;
  updateVideoSource: (
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    dto: $CourseLessonVideoAPI.UpdateVideo.Dto,
  ) => Promise<$CourseLessonVideoAPI.UpdateVideoSource.Response["data"]>;
  deleteVideo: (
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
  ) => Promise<$CourseLessonVideoAPI.DeleteVideo.Response["data"]>;
}

export interface ICourseLessonVideoRepository {
  createVideo: (
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonVideoResourceId, "lessonId">;
    },
    data: $CourseLessonVideoAPI.CreateVideo.Dto,
  ) => Promise<CourseLessonVideoModel>;
  getVideos: (
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonVideoResourceId, "lessonId">;
    },
    query?: $CourseLessonVideoAPI.GetVideos.Query,
  ) => Promise<CourseLessonVideoModel[]>;
  getVideoById: (id: {
    videoId: number;
    resourceId?: CourseLessonVideoResourceId;
  }) => Promise<CourseLessonVideoModel | null>;
  getVideoByIdOrThrow: (
    id: {
      videoId: number;
      resourceId?: CourseLessonVideoResourceId;
    },
    error?: Error,
  ) => Promise<CourseLessonVideoModel>;
  updateVideo: (
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    data: Partial<CourseLessonVideoModel>,
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (id: {
    videoId: number;
    resourceId: CourseLessonVideoResourceId;
  }) => Promise<{}>;
}
