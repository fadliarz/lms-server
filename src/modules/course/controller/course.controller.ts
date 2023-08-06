import { injectable, inject } from "inversify";
import { CourseDITypes, GetOneCourse, GetOneCourseQuery } from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { handleError } from "../../../common/exceptions/handleError";
import { Role, User } from "@prisma/client";
import { getResponseJson } from "../../../common/response/getResponseJson";
import { InternalServerException } from "../../../common/exceptions/InternalServerException";
import { getRequestQuery } from "../../../common/functions/getRequestQuery";
import { AuthenticatedRequest } from "../../../common/types";

export interface ICourseController {
  createCourse: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  updateCourse: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getAllCourses: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getCourseById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getAllOwnedCourses: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  setLike: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getCourseLessonsById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseController implements ICourseController {
  @inject(CourseDITypes.COURSE_SERVICE)
  private readonly courseService: ICourseService;

  public async getCourseLessonsById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const lessons = await this.courseService.getCourseLessonsById(
        req.params.courseId
      );
    } catch (error) {}
  }

  public async setLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      return res
        .status(StatusCode.SUCCESS)
        .json(
          getResponseJson(
            true,
            StatusCode.SUCCESS,
            await this.courseService.setLike(user.id, req.params.courseId)
          )
        );
    } catch (error) {
      handleError(error, next);
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
      handleError(error, next);
    }
  }

  public async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const course = await this.courseService.updateCourse(
        user.id,
        req.params.courseId,
        req.body as UpdateCourseDto
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, course));
    } catch (error) {
      handleError(error, next);
    }
  }

  public async getAllCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const role = req.query.role as string;

      const courses = await this.courseService.getAllCourses(
        user.id,
        role.toUpperCase() as Role
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, courses));
    } catch (error) {
      handleError(error, next);
    }
  }

  public async getAllOwnedCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const courses = this.courseService.getAllOwnedCourses(user.id);

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, courses));
    } catch (error) {
      handleError(error, next);
    }
  }

  public async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const query = getRequestQuery<GetOneCourseQuery>(req);

      const course = await this.courseService.getOneCourse(
        req.params.courseId,
        query
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, course));
    } catch (error) {
      handleError(error, next);
    }
  }
}
