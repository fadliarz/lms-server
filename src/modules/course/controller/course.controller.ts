import { injectable, inject } from "inversify";
import { CourseDITypes } from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { getResponseJson } from "../../../common/functions/getResponseJson";

export interface ICourseController {
  deleteLike: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createLike: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
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
  getMany: (
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
export class CourseController implements ICourseController {
  @inject(CourseDITypes.SERVICE)
  private readonly service: ICourseService;

  public async deleteLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const like = await this.service.deleteLike(
        user.id,
        Number(Number(req.params.courseId))
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, like));
    } catch (error) {
      next(error);
    }
  }

  public async createLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const like = await this.service.createLike(
        user.id,
        Number(req.params.courseId)
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, like));
    } catch (error) {
      next(error);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedCourse = await this.service.delete(
        Number(req.params.courseId)
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedCourse));
    } catch (error) {
      throw error;
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const course = await this.service.update(
        Number(req.params.courseId),
        req.body as UpdateCourseDto
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, course));
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
      const course = await this.service.getById(
        Number(req.params.courseId),
        req.query
      );

      res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, course));
    } catch (error) {
      next(error);
    }
  }

  public async getMany(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const courses = await this.service.getMany(user.id, req.query);

      console.log(courses);

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, courses));
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
      const user = getRequestUserOrThrowAuthenticationException(req);
      const course = await this.service.create(
        user.id,
        req.body as CreateCourseDto
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json(getResponseJson(true, StatusCode.RESOURCE_CREATED, course));
    } catch (error) {
      next(error);
    }
  }
}
