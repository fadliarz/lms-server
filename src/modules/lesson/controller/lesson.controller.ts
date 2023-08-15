import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseLessonDITypes } from "../lesson.type";
import { ICourseLessonService } from "../service/lesson.service";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/response/getResponseJson";

export interface ICourseLessonController {
  deleteLesson: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateLesson: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getLessonById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createLesson: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseLessonController implements ICourseLessonController {
  @inject(CourseLessonDITypes.SERVICE)
  private readonly courseLessonService: ICourseLessonService;

  public async deleteLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedLesson = await this.courseLessonService.deleteLesson(
        Number(req.params.lessonId),
        Number(req.params.courseId)
      );

      res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedLesson));
    } catch (error) {}
  }

  public async updateLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const updatedLesson = await this.courseLessonService.updateLesson(
        Number(req.params.lessonId),
        Number(req.params.courseId),
        req.body
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedLesson));
    } catch (error) {
      next(error);
    }
  }

  public async getLessonById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const lesson = await this.courseLessonService.getLessonById(
        Number(req.params.lessonId)
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, lesson));
    } catch (error) {
      next(error);
    }
  }

  public async createLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const lesson = await this.courseLessonService.createLesson(
        Number(req.params.courseId),
        req.body
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, lesson));
    } catch (error) {
      next(error);
    }
  }
}
