import "reflect-metadata";
import { injectable, inject } from "inversify";
import {
  CourseDITypes,
  CourseLikeResourceId,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCourseByIdQuery,
  GetEnrolledCoursesQuery,
} from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseDtoJoi,
  CreateCourseLikeDtoJoi,
  GetCourseByIdQueryJoi,
  GetCoursesQueryJoi,
  GetEnrolledCourseByIdQueryJoi,
  UpdateCourseDtoJoi,
} from "./course.joi";
import ClientException from "../../../common/class/exceptions/ClientException";
import isNaNArray from "../../../common/functions/isNaNArray";

export interface ICourseController {
  createCourse: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCourseById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getCourses: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getEnrolledCourseById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getEnrolledCourses: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCourse: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteCourse: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  createLike: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteLike: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

@injectable()
export class CourseController implements ICourseController {
  @inject(CourseDITypes.SERVICE)
  private readonly service: ICourseService;

  public async createCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseDtoJoi })(req, res, next);

      const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
      const newCourse = await this.service.createCourse(
        userId,
        req.body as CreateCourseDto,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newCourse });
    } catch (error) {
      next(error);
    }
  }

  public async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCourseByIdQueryJoi })(req, res, next);

      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        throw new ClientException();
      }

      const course = await this.service.getCourseById(
        courseId,
        req.query as unknown as GetCourseByIdQuery,
      );

      res.status(StatusCode.SUCCESS).json({ data: course });
    } catch (error) {
      next(error);
    }
  }

  public async getCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCoursesQueryJoi })(req, res, next);

      const courses = await this.service.getCourses(
        (req as any).query as GetCoursesQuery,
      );

      return res.status(StatusCode.SUCCESS).json({ data: courses });
    } catch (error) {
      next(error);
    }
  }

  public async getEnrolledCourseById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await validateJoi({ query: GetEnrolledCourseByIdQueryJoi })(
        req,
        res,
        next,
      );

      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        throw new ClientException();
      }

      const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
      const enrolledCourse = await this.service.getEnrolledCourseById(
        userId,
        courseId,
        req.query as unknown as GetEnrolledCourseByIdQuery,
      );

      return res.status(StatusCode.SUCCESS).json({ data: enrolledCourse });
    } catch (error) {
      next(error);
    }
  }

  public async getEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
      const courses = await this.service.getEnrolledCourses(
        userId,
        req.query as unknown as GetEnrolledCoursesQuery,
      );

      return res.status(StatusCode.SUCCESS).json({ data: courses });
    } catch (error) {
      next(error);
    }
  }

  public async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseDtoJoi })(req, res, next);

      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        throw new ClientException();
      }

      const updatedCourse = await this.service.updateCourse(
        courseId,
        req.body as UpdateCourseDto,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCourse });
    } catch (error) {
      next(error);
    }
  }

  public async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const courseId = Number(req.params.courseId);
      if (isNaN(courseId)) {
        throw new ClientException();
      }

      await this.service.deleteCourse(courseId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  public async createLike(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseLikeDtoJoi })(req, res, next);

      const resource: CourseLikeResourceId = (req as any).resourceId;
      const courseId = resource.courseId;
      if (isNaN(courseId)) {
        throw new ClientException();
      }

      const { id: userId } = getRequestUserOrThrowAuthenticationException(req);
      const newLike = await this.service.createLike(
        userId,
        (req as any).resourceId,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newLike });
    } catch (error) {
      next(error);
    }
  }

  public async deleteLike(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const resource: CourseLikeResourceId = (req as any).resourceId;
      const courseId = resource.courseId;
      const likeId = resource.courseId;
      if (isNaNArray([courseId, likeId])) {
        throw new ClientException();
      }

      await this.service.deleteLike((req as any).resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }
}
