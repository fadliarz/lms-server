import { injectable, inject } from "inversify";
import { CourseDITypes } from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { getRequestUser } from "../../../common/functions/getRequestUser";
import { handleError } from "../../../common/exceptions/handleError";
import { Role } from "@prisma/client";

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
  getAllCourses: (role: Role) => {
    (req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  };
  getOneCourse: (role: Role) => {
    (req: Request, res: Response, next: NextFunction): Promise<Response | void>;
  };
  getAllOwnedCourses: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>;
}

@injectable()
export class CourseController implements ICourseController {
  @inject(CourseDITypes.COURSE_SERVICE) private courseService: ICourseService;

  public async createCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUser(req);

      const course = await this.courseService.createCourse(
        user.id,
        req.body as CreateCourseDto
      );

      return res.status(StatusCode.RESOURCE_CREATED).json(course);
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
      const user = getRequestUser(req);

      const course = await this.courseService.updateCourse(
        user.id,
        req.params.courseId,
        req.body as UpdateCourseDto
      );

      return res.status(StatusCode.SUCCESS).json(course);
    } catch (error) {
      handleError(error, next);
    }
  }

  public getAllCourses(role: Role) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      try {
        const user = getRequestUser(req);

        const courses = await this.courseService.getAllCourses(
          user.id,
          role
        );

        return res.status(StatusCode.SUCCESS).json(courses);
      } catch (error) {
        handleError(error, next);
      }
    };
  }

  public async getAllOwnedCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user = getRequestUser(req);

      const courses = this.courseService.getAllOwnedCourses(user.id);

      return res.status(StatusCode.SUCCESS).json(courses);
    } catch (error) {
      handleError(error, next);
    }
  }

  public getOneCourse(role: Role) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      try {
        const user = getRequestUser(req);

        const course = await this.courseService.getOneCourse(
          user.id,
          role,
          req.params.courseId
        );

        return res.status(StatusCode.SUCCESS).json(course);
      } catch (error) {
        handleError(error, next);
      }
    };
  }
}
