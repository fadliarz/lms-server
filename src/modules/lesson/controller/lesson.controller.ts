import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseLessonDITypes } from "../lesson.type";
import { ICourseLessonService } from "../service/lesson.service";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/functions/getResponseJson";

export interface ICourseLessonController {
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
  getById: (
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
export class CourseLessonController implements ICourseLessonController {
  @inject(CourseLessonDITypes.SERVICE)
  private readonly service: ICourseLessonService;

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedLesson = await this.service.delete(
        Number(req.params.lessonId),
        Number((req as any).courseId)
      );

      res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedLesson));
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
      const updatedLesson = await this.service.update(
        Number(req.params.lessonId),
        req.body
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedLesson));
    } catch (error) {
      next(error);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const lesson = await this.service.getById(Number(req.params.lessonId));

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, lesson));
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
      const lesson = await this.service.create(req.body);

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, lesson));
    } catch (error) {
      next(error);
    }
  }
}
