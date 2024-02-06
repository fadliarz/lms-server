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
import NaNException from "../../../common/class/exceptions/NaNException";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

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

      const resourceId = this.validateResourceId(req);
      const newLesson = await this.service.createLesson(resourceId, req.body);

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
      const lessonId = this.validateLessonId(req);
      const resourceId = this.validateResourceId(req);
      const lesson = await this.service.getLessonById(lessonId, resourceId);

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

      const lessonId = this.validateLessonId(req);
      const resourceId = this.validateResourceId(req);
      const updatedLesson = await this.service.updateLesson(
        lessonId,
        resourceId,
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
      const lessonId = this.validateLessonId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteLesson(lessonId, resourceId);

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
    error?: Error,
  ): CourseLessonResourceId {
    const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw error || new NaNException("courseId");
    }

    return {
      userId,
      courseId,
    };
  }

  private validateLessonId(req: Request, error?: Error): number {
    const lessonId: number = Number(req.params.lessonId);
    if (isNaN(lessonId)) {
      throw error || new NaNException("lessonId");
    }

    return lessonId;
  }
}
