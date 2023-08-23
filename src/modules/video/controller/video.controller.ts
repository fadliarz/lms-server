import { injectable, inject } from "inversify";
import { CourseLessonVideoDITypes } from "../video.type";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/functions/getResponseJson";
import { ICourseLessonVideoService } from "../service/video.service";

export interface ICourseLessonVideoController {
  delete: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  update: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  create: (
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
  service: ICourseLessonVideoService;

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedVideo = await this.service.delete(
        (req as any).ids,
        (req as any).video
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedVideo));
    } catch (error) {
      next(error);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const updatedVideo = await this.service.update(
        (req as any).ids,
        (req as any).video,
        req.body
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedVideo));
    } catch (error) {
      next(error);
    }
  }

  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const video = await this.service.create((req as any).ids, req.body);

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, video));
    } catch (error) {
      next(error);
    }
  }
}
