import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseLessonDITypes, CourseLessonResourceId } from "../lesson.type";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseLessonDtoJoi,
  UpdateBasicCourseLessonDtoJoi,
} from "./lesson.joi";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  ICourseLessonController,
  ICourseLessonService,
} from "../lesson.interface";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

@injectable()
export default class CourseLessonController implements ICourseLessonController {
  @inject(CourseLessonDITypes.SERVICE)
  private readonly service: ICourseLessonService;

  public async createLesson(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseLessonDtoJoi })(req, res, next);

      const newLesson = await this.service.createLesson(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newLesson,
      });
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
      const lesson = await this.service.getLessonById({
        lessonId: this.validateLessonId(req),
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getLessons(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const lessons = await this.service.getLessons({
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: lessons,
      });
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
      await validateJoi({ body: UpdateBasicCourseLessonDtoJoi })(
        req,
        res,
        next,
      );

      const updatedLesson = await this.service.updateLesson(
        getRequestUserOrThrowAuthenticationException(req),
        {
          lessonId: this.validateLessonId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedLesson,
      });
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
      await this.service.deleteLesson(
        getRequestUserOrThrowAuthenticationException(req),
        {
          lessonId: this.validateLessonId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseLessonResourceId {
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return {
      courseId,
    };
  }

  private validateLessonId(req: Request): number {
    const lessonId: number = Number(req.params.lessonId);
    if (isNaN(lessonId)) {
      throw new NaNException("lessonId");
    }

    return lessonId;
  }
}
