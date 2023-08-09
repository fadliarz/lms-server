import { injectable, inject } from "inversify";
import {
  CourseDITypes,
  CourseModel,
  GetCourseQuery,
  GetCoursesQuery,
} from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { getRequestUserOrThrowAuthenticationException } from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { handleError } from "../../../common/exceptions/handleError";
import { getResponseJson } from "../../../common/response/getResponseJson";
import { Role } from "@prisma/client";
import { doMinimumRoleAuthorization } from "../../../common/functions/doMinimumRoleAuthorization";

export interface ICourseController {
  deleteCourse: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
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
  getCourses: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  getCourseById: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
  setLike: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseController implements ICourseController {
  @inject(CourseDITypes.COURSE_SERVICE)
  private readonly courseService: ICourseService;

  public async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const deletedCourse = await this.courseService.deleteCourse(
        req.params.courseId
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, deletedCourse));
    } catch (error) {}
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

  public async getCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);

      const query = req.query as GetCoursesQuery;

      let courses: CourseModel[];

      if (new RegExp(Role.OWNER, "i").test(user.role)) {
        doMinimumRoleAuthorization(user.role, Role.OWNER);

        courses = await this.courseService.getOwnedCourses(user.id);
      } else {
        courses = await this.courseService.getEnrolledCourses(user.id, query);
      }

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
      const course = await this.courseService.getCourseById(
        req.params.courseId,
        req.query as GetCourseQuery
      );

      return res
        .status(StatusCode.SUCCESS)
        .json(getResponseJson(true, StatusCode.SUCCESS, course));
    } catch (error) {
      handleError(error, next);
    }
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
}
