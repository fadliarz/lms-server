import { injectable, inject } from "inversify";
import { CourseDITypes } from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { getResponseJson } from "../../../common/response/getResponseJson";

export interface ICourseController {
  deleteCourseLike: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createCourseLike: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  deleteCourse: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateCourse: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getCourseById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getCourses: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  createCourse: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseController implements ICourseController {
  @inject(CourseDITypes.SERVICE)
  private readonly courseService: ICourseService;

  public async deleteCourseLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const like = await this.courseService.deleteCourseLike(
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

  public async createCourseLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const like = await this.courseService.createCourseLike(
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

  public async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedCourse = await this.courseService.deleteCourse(
        Number(req.params.courseId)
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedCourse));
    } catch (error) {}
  }

  public async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const course = await this.courseService.updateCourse(
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

  public async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const course = await this.courseService.getCourseById(
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

  public async getCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const courses = await this.courseService.getCourses(user.id, req.query);

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, courses));
    } catch (error) {
      next(error);
    }
  }

  public async createCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const course = await this.courseService.createCourse(
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
