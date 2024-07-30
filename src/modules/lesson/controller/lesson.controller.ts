import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonResourceId,
  ValuableCourseLessonModel,
} from "../lesson.type";
import { StatusCode } from "../../../common/constants/statusCode";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseLessonDtoJoi,
  UpdateBasicCourseLessonDtoJoi,
} from "./lesson.joi";
import NaNException from "../../../common/class/exceptions/NaNException";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import getValuable from "../../../common/functions/removeNullFields";
import {
  ICourseLessonController,
  ICourseLessonService,
} from "../lesson.interface";
import { UnauthenticatedResourceId } from "../../../common/types";

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

      const resourceId = this.validateResourceId(req);
      const newLesson = await this.service.createLesson(resourceId, req.body);

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: getValuable(newLesson) satisfies ValuableCourseLessonModel,
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
      const lessonId = this.validateLessonId(req);
      const resourceId = this.validateUnauthenticatedResourceId(req);
      const lesson = await this.service.getLessonById(lessonId, resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: getValuable(lesson) satisfies ValuableCourseLessonModel,
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
      const resourceId = this.validateUnauthenticatedResourceId(req);
      const lessons = await this.service.getLessons(resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: lessons.map((lesson) =>
          getValuable(lesson),
        ) satisfies ValuableCourseLessonModel[],
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateBasicLesson(
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

      const lessonId = this.validateLessonId(req);
      const resourceId = this.validateResourceId(req);
      const updatedLesson = await this.service.updateBasicLesson(
        lessonId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: getValuable(updatedLesson) satisfies ValuableCourseLessonModel,
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
      const lessonId = this.validateLessonId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteLesson(lessonId, resourceId);

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseLessonResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return {
      user: { id: userId, role },
      courseId,
    };
  }

  private validateUnauthenticatedResourceId(
    req: Request,
  ): UnauthenticatedResourceId<CourseLessonResourceId> {
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
