import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseLessonDITypes, CourseLessonResourceId } from "../lesson.type";
import { ICourseLessonService } from "../service/lesson.service";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseLessonDtoJoi,
  UpdateCourseLessonDtoJoi,
} from "./lesson.joi";
import ClientException from "../../../common/class/exceptions/ClientException";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";

export interface ICourseLessonController {
  createLesson: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getLessonById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateLesson: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteLesson: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

@injectable()
export class CourseLessonController implements ICourseLessonController {
  @inject(CourseLessonDITypes.SERVICE)
  private readonly service: ICourseLessonService;

  public async createLesson(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseLessonDtoJoi })(req, res, next);

      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        throw new NaNException("courseId");
      }

      const newLesson = await this.service.createLesson(courseId, req.body);

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newLesson });
    } catch (error) {
      next(error);
    }
  }

  public async getLessonById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const courseId = Number(req.params.courseId);
      const lessonId = Number(req.params.lessonId);
      if (isNaNArray([courseId, lessonId])) {
        throw new NaNException("courseId || lessonId");
      }

      const resource: CourseLessonResourceId = {
        courseId,
      };
      const lesson = await this.service.getLessonById(lessonId, resource);

      return res.status(StatusCode.SUCCESS).json({ data: lesson });
    } catch (error) {
      next(error);
    }
  }

  public async updateLesson(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseLessonDtoJoi })(req, res, next);

      const courseId = Number(req.params.courseId);
      const lessonId = Number(req.params.lessonId);
      if (isNaNArray([courseId, lessonId])) {
        throw new NaNException("courseId || lessonId");
      }

      const resource: CourseLessonResourceId = {
        courseId,
      };
      const updatedLesson = await this.service.updateLesson(
        lessonId,
        resource,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedLesson });
    } catch (error) {
      next(error);
    }
  }

  public async deleteLesson(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const courseId = Number(req.params.courseId);
      const lessonId = Number(req.params.lessonId);
      if (isNaNArray([courseId, lessonId])) {
        throw new NaNException("courseId || lessonId");
      }

      const resource: CourseLessonResourceId = {
        courseId,
      };
      await this.service.deleteLesson(lessonId, resource);

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }
}
