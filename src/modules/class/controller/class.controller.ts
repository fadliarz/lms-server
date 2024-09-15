import { inject, injectable } from "inversify";
import { CourseClassDITypes, CourseClassResourceId } from "../class.type";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import NaNException from "../../../common/class/exceptions/NaNException";
import {
  CreateCourseClassDtoJoi,
  GetCourseClassesQueryJoi,
  UpdateCourseClassDtoJoi,
} from "./class.joi";
import {
  ICourseClassController,
  ICourseClassService,
} from "../class.interface";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import getPagingQuery from "../../../common/functions/getPagingQuery";

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

      const newClass = await this.service.createClass(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newClass,
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
      await validateJoi({ query: GetCourseClassesQueryJoi })(req, res, next);

      const classes = await this.service.getClasses(
        {
          resourceId: this.validateResourceId(req),
        },
        getPagingQuery(req.query),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: classes,
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
      const theClass = await this.service.getClassById({
        classId: this.validateClassId(req),
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: theClass,
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

      const updatedClass = await this.service.updateClass(
        getRequestUserOrThrowAuthenticationException(req),
        {
          classId: this.validateClassId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedClass,
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
      await this.service.deleteClass(
        getRequestUserOrThrowAuthenticationException(req),
        {
          classId: this.validateClassId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseClassResourceId {
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
