import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseLessonDITypes } from "../lesson.type";
import { ICourseLessonService } from "../service/lesson.service";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseLessonDtoJoi,
  UpdateCourseLessonDtoJoi,
} from "./lesson.joi";

export interface ICourseLessonController {
  createLesson: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getLessonById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateLesson: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  deleteLesson: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseLessonController implements ICourseLessonController {
  @inject(CourseLessonDITypes.SERVICE)
  private readonly service: ICourseLessonService;

  public async createLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseLessonDtoJoi })(req, res, next);

      const newLesson = await this.service.createLesson(
        Number(req.params.courseId),
        req.body
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newLesson });
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
      const lesson = await this.service.getLessonById(
        Number(req.params.courseId),
        Number(req.params.lessonId)
      );

      return res.status(StatusCode.SUCCESS).json({ data: lesson });
    } catch (error) {
      next(error);
    }
  }

  public async updateLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseLessonDtoJoi })(req, res, next);

      const updatedLesson = await this.service.updateLesson(
        Number(req.params.lessonId),
        req.body
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedLesson });
    } catch (error) {
      next(error);
    }
  }

  public async deleteLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.service.deleteLesson(
        Number((req as any).courseId),
        Number(req.params.lessonId)
      );

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }
}
