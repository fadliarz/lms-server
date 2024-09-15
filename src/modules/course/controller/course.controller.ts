import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseDITypes,
  CourseLikeResourceId,
  CourseResourceId,
} from "../course.type";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import validateJoi from "../../../common/functions/validateJoi";
import {
  CreateCourseDtoJoi,
  CreateCourseInstructorDtoJoi,
  CreateCourseLikeDtoJoi,
  GetCourseByIdQueryJoi,
  GetCourseInstructorsQueryJoi,
  GetCoursesQueryJoi,
  UpdateCourseCategoryIdDtoJoi,
  UpdateCourseCodeDtoJoi,
  UpdateCourseDtoJoi,
  UpdateCourseStatusDtoJoi,
} from "./course.joi";
import NaNException from "../../../common/class/exceptions/NaNException";
import { ICourseController, ICourseService } from "../course.interface";
import convertStringToBoolean from "../../../common/functions/convertStringToBoolean";
import { $CourseAPI } from "../course.api";
import getPagingQuery from "../../../common/functions/getPagingQuery";

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
      const newCourse = await this.service.createCourse(
        { resourceId },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newCourse });
    } catch (error) {
      next(error);
    }
  }

  public async createCourseInstructor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseInstructorDtoJoi })(req, res, next);

      const resourceId = this.validateResourceId(req);
      const newCourse = await this.service.createCourseInstructor(
        getRequestUserOrThrowAuthenticationException(req),
        { courseId: this.validateCourseId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({ data: newCourse });
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

      const query: $CourseAPI.GetCourses.Query = {
        include_category: convertStringToBoolean(
          req.query.include_category as string,
        ),
        ...getPagingQuery(req.query),
      };

      const courses = await this.service.getCourses(query);

      return res.status(StatusCode.SUCCESS).json({ data: courses });
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
      const reqQuery = req.query as {
        [K in keyof $CourseAPI.GetCourseById.Query]: string | undefined;
      };
      const query: $CourseAPI.GetCourseById.Query = {
        include_category: convertStringToBoolean(reqQuery.include_category),
        include_lessons: convertStringToBoolean(reqQuery.include_lessons),
        include_public_videos: convertStringToBoolean(
          reqQuery.include_public_videos,
        ),
      };

      const course = await this.service.getCourseById({ courseId }, query);

      res.status(StatusCode.SUCCESS).json({
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getCourseInstructors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCourseInstructorsQueryJoi })(
        req,
        res,
        next,
      );

      const courses = await this.service.getCourseInstructors(
        getRequestUserOrThrowAuthenticationException(req),
        { courseId: this.validateCourseId(req) },
        getPagingQuery(req.query),
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

      const courseId = this.validateCourseId(req);
      const resourceId = this.validateResourceId(req);

      const updatedCourse = await this.service.updateCourse(
        {
          courseId,
          resourceId,
        },
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
        {
          courseId,
          resourceId,
        },
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
        {
          courseId,
          resourceId,
        },
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
        {
          courseId,
          resourceId,
        },
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

      await this.service.deleteCourse({ courseId, resourceId });

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

      const newLike = await this.service.createLike({ resourceId });

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

      await this.service.deleteLike({ likeId, resourceId });

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request, error?: Error): CourseResourceId {
    const user = getRequestUserOrThrowAuthenticationException(req);

    return {
      user,
    };
  }

  private validateLikeResourceId(req: Request): CourseLikeResourceId {
    const user = getRequestUserOrThrowAuthenticationException(req);
    const courseId = Number(req.params.courseId);
    if (isNaN(courseId)) {
      throw new NaNException("courseId");
    }

    return {
      user,
      params: { courseId },
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
