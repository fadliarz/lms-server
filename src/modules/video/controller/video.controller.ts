import { injectable, inject } from "inversify";
import { CourseLessonVideoDITypes } from "../video.type";
import { Request, Response, NextFunction } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseLessonVideoService } from "../service/video.service";

export interface ICourseLessonVideoController {
  createVideo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getVideoById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateVideo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  deleteVideo: (
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

  public async createVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const newVideo = await this.service.createVideo(
        (req as any).resourceId,
        req.body
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newVideo });
    } catch (error) {
      next(error);
    }
  }

  public async getVideoById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const video = await this.service.getVideoById((req as any).resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: video });
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
      const updatedVideo = await this.service.updateVideo(
        (req as any).resourceId,
        req.body
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedVideo });
    } catch (error) {
      next(error);
    }
  }

  public async deleteVideo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.service.deleteVideo((req as any).resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }
}
