import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseDITypes,
  CourseLikeResourceId,
  CourseResourceId,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCoursesQuery,
} from "../course.type";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseDtoJoi,
  CreateCourseLikeDtoJoi,
  GetCourseByIdQueryJoi,
  GetCoursesQueryJoi,
  GetEnrolledCoursesQueryJoi,
  UpdateBasicCourseDtoJoi,
  UpdateCourseCategoryIdDtoJoi,
  UpdateCourseCodeDtoJoi,
  UpdateCourseStatusDtoJoi,
} from "./course.joi";
import NaNException from "../../../common/class/exceptions/NaNException";
import processBoolean from "../../../common/functions/processBoolean";
import { ICourseController, ICourseService } from "../course.interface";

@injectable()
export default class CourseController implements ICourseController {
  @inject(CourseDITypes.SERVICE)
  private readonly service: ICourseService;

  public async createCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseDtoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newCourse = await this.service.createCourse(resourceId, req.body);

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

      const courseId = this.validateCourseId(req);
      const resourceId = {} as CourseResourceId;
      const query = req.query as unknown as GetCourseByIdQuery;
      query.include_author = processBoolean(query.include_author as any);
      query.include_category = processBoolean(query.include_category as any);
      query.include_public_videos = processBoolean(
        query.include_public_videos as any,
      );
      const course = await this.service.getCourseById(
        courseId,
        resourceId,
        query,
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

      const query = req.query as any as GetCoursesQuery;
      query.include_author = processBoolean(query.include_author as any);
      query.include_category = processBoolean(query.include_category as any);
      query.pageNumber = Number(query.pageNumber);
      query.pageSize = Number(query.pageSize);
      const courses = await this.service.getCourses(query);

      return res.status(StatusCode.SUCCESS).json({ data: courses });
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
      await validateJoi({ query: GetEnrolledCoursesQueryJoi })(req, res, next);

      const query = req.query as unknown as GetEnrolledCoursesQuery;
      query.limit_student_courses = query.limit_student_courses
        ? Number(query.limit_student_courses)
        : 3;
      query.limit_instructor_courses = query.limit_instructor_courses
        ? Number(query.limit_instructor_courses)
        : 3;
      query.include_author = processBoolean(query.include_author as any);
      query.include_category = processBoolean(query.include_category as any);
      const resourceId = this.validateResourceId(req);
      const courses = await this.service.getEnrolledCourses(resourceId, query);

      return res.status(StatusCode.SUCCESS).json({ data: courses });
    } catch (error) {
      next(error);
    }
  }

  public async updateBasicCourse(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateBasicCourseDtoJoi })(req, res, next);

      const courseId = this.validateCourseId(req);
      const resourceId = this.validateResourceId(req);
      const updatedCourse = await this.service.updateBasicCourse(
        courseId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCourse });
    } catch (error) {
      next(error);
    }
  }

  public async updateCourseStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseStatusDtoJoi })(req, res, next);

      const courseId = this.validateCourseId(req);
      const resourceId = this.validateResourceId(req);
      const updatedCourse = await this.service.updateCourseStatus(
        courseId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCourse });
    } catch (error) {
      next(error);
    }
  }

  public async updateCourseCategoryId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseCategoryIdDtoJoi })(req, res, next);

      const courseId = this.validateCourseId(req);
      const resourceId = this.validateResourceId(req);
      const updatedCourse = await this.service.updateCourseCategoryId(
        courseId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedCourse });
    } catch (error) {
      next(error);
    }
  }

  public async updateCourseCode(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseCodeDtoJoi })(req, res, next);

      const courseId = this.validateCourseId(req);
      const resourceId = this.validateResourceId(req);
      const updatedCourse = await this.service.updateCourseCode(
        courseId,
        resourceId,
        req.body,
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
      const courseId = this.validateCourseId(req);
      const resourceId = this.validateResourceId(req);
      await this.service.deleteCourse(courseId, resourceId);

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

      const resourceId = this.validateLikeResourceId(req);
      const newLike = await this.service.createLike(resourceId);

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
      const likeId = this.validateLikeId(req);
      const resourceId = this.validateLikeResourceId(req);
      await this.service.deleteLike(likeId, resourceId);

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request, error?: Error): CourseResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);

    return {
      user: {
        id: userId,
        role,
      },
    };
  }

  private validateLikeResourceId(req: Request): CourseLikeResourceId {
    const { id: userId, role } =
      getRequestUserOrThrowAuthenticationException(req);
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return {
      user: {
        id: userId,
        role,
      },
      courseId,
    };
  }

  private validateCourseId(req: Request): number {
    const courseId: number = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return courseId;
  }

  private validateLikeId(req: Request): number {
    const likeId: number = Number(req.params.likeId);
    if (isNaN(likeId)) {
      throw new NaNException("likeId");
    }

    return likeId;
  }
}
