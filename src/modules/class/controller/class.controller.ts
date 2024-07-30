import { inject, injectable } from "inversify";
import {
  CourseClassDITypes,
  CourseClassResourceId,
  ValuableCourseClassModel,
} from "../class.type";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getValuable from "../../../common/functions/removeNullFields";
import { ValuableCourseLessonModel } from "../../lesson/lesson.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import { CreateCourseClassDtoJoi, UpdateCourseClassDtoJoi } from "./class.joi";
import {
  ICourseClassController,
  ICourseClassService,
} from "../class.interface";
import { UnauthenticatedResourceId } from "../../../common/types";

@injectable()
export default class CourseClassController implements ICourseClassController {
  @inject(CourseClassDITypes.SERVICE)
  private readonly service: ICourseClassService;

  public async createClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseClassDtoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newClass = await this.service.createClass(resourceId, req.body);

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: getValuable(newClass) satisfies ValuableCourseLessonModel,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getClassById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const classId = this.validateClassId(req);
      const resourceId = this.validateUnauthenticatedResourceId(req);
      const theClass = await this.service.getClassById(classId, resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: getValuable(theClass) satisfies ValuableCourseClassModel,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getClasses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const resourceId = this.validateUnauthenticatedResourceId(req);
      const classes = await this.service.getClasses(resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: classes.map((theClass) =>
          getValuable(theClass),
        ) satisfies ValuableCourseClassModel[],
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseClassDtoJoi })(req, res, next);

      const classId = this.validateClassId(req);
      const resourceId = this.validateResourceId(req);
      const updatedClass = await this.service.updateClass(
        classId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: getValuable(updatedClass) satisfies ValuableCourseClassModel,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteClass(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const classId = this.validateClassId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteClass(classId, resourceId);

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseClassResourceId {
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
  ): UnauthenticatedResourceId<CourseClassResourceId> {
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return {
      courseId,
    };
  }

  private validateClassId(req: Request): number {
    const classId: number = Number(req.params.classId);
    if (isNaN(classId)) {
      throw new NaNException("classId");
    }

    return classId;
  }
}
