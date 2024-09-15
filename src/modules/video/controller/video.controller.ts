import { inject, injectable } from "inversify";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoResourceId,
} from "../video.type";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  ICourseLessonVideoController,
  ICourseLessonVideoService,
} from "../video.interface";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import {
  CreateCourseLessonVideoDtoJoi,
  GetCourseLessonVideosQueryJoi,
  UpdateCourseLessonVideoDtoJoi,
  UpdateCourseLessonVideoSourceDtoJoi,
} from "./video.joi";
import getPagingQuery from "../../../common/functions/getPagingQuery";

@injectable()
export default class CourseLessonVideoController
  implements ICourseLessonVideoController
{
  @inject(CourseLessonVideoDITypes.SERVICE)
  service: ICourseLessonVideoService;

  public async createVideo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseLessonVideoDtoJoi })(
        req,
        res,
        next,
      );

      const newVideo = await this.service.createVideo(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newVideo });
    } catch (error) {
      next(error);
    }
  }

  public async getVideos(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCourseLessonVideosQueryJoi })(
        req,
        res,
        next,
      );

      const videos = await this.service.getVideos(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        getPagingQuery(req.query),
      );

      return res.status(StatusCode.SUCCESS).json({ data: videos });
    } catch (error) {
      next(error);
    }
  }

  public async getVideoById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const video = await this.service.getVideoById(
        getRequestUserOrThrowAuthenticationException(req),
        {
          videoId: this.validateVideoId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({ data: video });
    } catch (error) {
      next(error);
    }
  }

  public async updateVideo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseLessonVideoDtoJoi })(
        req,
        res,
        next,
      );

      const updatedVideo = await this.service.updateVideo(
        getRequestUserOrThrowAuthenticationException(req),
        {
          videoId: this.validateVideoId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedVideo });
    } catch (error) {
      next(error);
    }
  }

  public async updateVideoSource(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseLessonVideoSourceDtoJoi })(
        req,
        res,
        next,
      );

      const updatedVideo = await this.service.updateVideoSource(
        getRequestUserOrThrowAuthenticationException(req),
        {
          videoId: this.validateVideoId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedVideo });
    } catch (error) {
      next(error);
    }
  }

  public async deleteVideo(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteVideo(
        getRequestUserOrThrowAuthenticationException(req),
        {
          videoId: this.validateVideoId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseLessonVideoResourceId {
    const courseId: number = Number(req.params.courseId);
    const lessonId: number = Number(req.params.lessonId);
    if (isNaNArray([courseId, lessonId])) {
      throw new NaNException("courseId || lessonId");
    }

    return {
      courseId,
      lessonId,
    };
  }

  private validateVideoId(req: Request): number {
    const videoId: number = Number(req.params.videoId);
    if (isNaN(videoId)) {
      throw new NaNException("videoId");
    }

    return videoId;
  }
}
