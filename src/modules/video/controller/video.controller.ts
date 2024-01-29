import { inject, injectable } from "inversify";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoResourceId,
} from "../video.type";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseLessonVideoService } from "../service/video.service";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseLessonVideoJoi,
  UpdateCourseLessonVideoSourceJoi,
} from "./video.joi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

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

@injectable()
export class CourseLessonVideoController
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
      await validateJoi({ body: CreateCourseLessonVideoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newVideo = await this.service.createVideo(resourceId, req.body);

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newVideo });
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
      const videoId = this.validateVideoId(req);
      const resourceId = this.validateResourceId(req);
      const video = await this.service.getVideoById(videoId, resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: video });
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
      await validateJoi({ body: UpdateCourseLessonVideoSourceJoi })(
        req,
        res,
        next,
      );

      const videoId = this.validateVideoId(req);
      const resourceId = this.validateResourceId(req);
      const updatedVideo = await this.service.updateVideoSource(
        videoId,
        resourceId,
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
      const videoId = this.validateVideoId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteVideo(videoId, resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
    error?: Error,
  ): CourseLessonVideoResourceId {
    const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
    const courseId: number = Number(req.params.courseId);
    const lessonId: number = Number(req.params.lessonId);
    if (isNaNArray([courseId, lessonId])) {
      throw error || new NaNException("courseId || lessonId");
    }

    return {
      userId,
      courseId,
      lessonId,
    };
  }

  private validateVideoId(req: Request, error?: Error): number {
    const videoId: number = Number(req.params.videoId);
    if (isNaN(videoId)) {
      throw error || new NaNException("courseId");
    }

    return videoId;
  }
}
