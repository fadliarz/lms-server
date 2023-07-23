import { injectable, inject } from "inversify";
import { CourseDITypes } from "../course.type";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { StatusCode } from "../../../common/constants/statusCode";
import { ICourseService } from "../service/course.service";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { getRequestUser } from "../../../common/functions/getRequestUser";
import { handleError } from "../../../common/exceptions/handleError";

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

  // getAllUserCourse: (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<Response>;
  // getAllTeacherCourses: (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<Response>;
  // getAllOwnerCourses: (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => Promise<Response>;
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

  public async updateCourse(req: Request, res: Response, next: NextFunction) {
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
}
