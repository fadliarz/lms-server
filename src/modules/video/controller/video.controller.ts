import { injectable, inject } from "inversify";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoParams,
} from "../video.type";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/response/getResponseJson";
import { ICourseLessonVideoService } from "../service/video.service";

export interface ICourseLessonVideoController {
  deleteVideo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateVideo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createVideo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseLessonVideoController
  implements ICourseLessonVideoController
{
  @inject(CourseLessonVideoDITypes.SERVICE)
  courseLessonVideoService: ICourseLessonVideoService;

  public async deleteVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedVideo = await this.courseLessonVideoService.deleteVideo(
        req.params as CourseLessonVideoParams
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedVideo));
    } catch (error) {
      next(error);
    }
  }

  public async updateVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const updatedVideo = await this.courseLessonVideoService.updateVideo(
        req.params as CourseLessonVideoParams,
        req.body
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedVideo));
    } catch (error) {
      next(error);
    }
  }

  public async createVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const video = await this.courseLessonVideoService.createVideo(
        req.params as CourseLessonVideoParams,
        req.body
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, video));
    } catch (error) {
      next(error);
    }
  }
}
