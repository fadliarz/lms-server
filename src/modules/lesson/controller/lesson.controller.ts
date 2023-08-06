import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { CourseLessonDITypes, CourseLessonParams } from "../lesson.type";
import { ICourseLessonService } from "../service/lesson.service";
import { handleError } from "../../../common/exceptions/handleError";
import { StatusCode } from "../../../common/constants/statusCode";
import { getResponseJson } from "../../../common/response/getResponseJson";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";

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
export class LessonController implements ICourseLessonController {
  @inject(CourseLessonDITypes.COURSE_LESSON_SERVICE)
  private readonly courseLessonService: ICourseLessonService;

  public async deleteLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const deletedLesson = await this.courseLessonService.deleteLesson(
        user.id,
        req.params as CourseLessonParams
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
      const user = getRequestUserOrThrowAuthenticationException(req);

      const updatedLesson = await this.courseLessonService.updateLesson(
        user.id,
        req.params as CourseLessonParams,
        req.body
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, updatedLesson));
    } catch (error) {
      handleError(error, next);
    }
  }

  public async getLessonById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const lesson = await this.courseLessonService.getLessonById(
        req.params.lessonId
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, lesson));
    } catch (error) {
      handleError(error, next);
    }
  }

  public async createLesson(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const lesson = await this.courseLessonService.createLesson(
        user.id,
        req.params as CourseLessonParams,
        req.body
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, lesson));
    } catch (error) {
      handleError(error, next);
    }
  }
}
