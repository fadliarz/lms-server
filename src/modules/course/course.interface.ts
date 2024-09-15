import { UserModel } from "../user/user.type";
import {
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
  CourseResourceId,
} from "./course.type";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { $CourseAPI } from "./course.api";

export interface ICourseAuthorization {
  authorizeCreateCourse: (user: UserModel) => Promise<void>;
  authorizeCreateCourseInstructor: (user: UserModel) => Promise<void>;
  authorizeGetCourseInstructors: (user: UserModel) => Promise<void>;
  authorizeUpdateCourse: (user: UserModel, courseId: number) => Promise<void>;
  authorizeDeleteCourse: (user: UserModel, courseId: number) => Promise<void>;
  authorizeCreateLike: (user: UserModel, courseId: number) => Promise<void>;
  authorizeDeleteLike: (
    user: UserModel,
    courseId: number,
    likeId: number,
  ) => Promise<void>;
}

export interface ICourseController {
  createCourse: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  createCourseInstructor: (
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
  getCourseInstructors: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCourse: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCourseStatus: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCourseCategoryId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateCourseCode: (
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

export interface ICourseService {
  createCourse: (
    id: { resourceId: CourseResourceId },
    dto: $CourseAPI.CreateCourse.Dto,
  ) => Promise<CourseModel>;
  createCourseInstructor: (
    user: UserModel,
    id: {
      courseId: number;
    },
    dto: $CourseAPI.CreateCourseInstructor.Dto,
  ) => Promise<$CourseAPI.CreateCourseInstructor.Response["data"]>;
  getCourses: (
    query: $CourseAPI.GetCourses.Query,
  ) => Promise<$CourseAPI.GetCourses.Response["data"]>;
  getCourseById: (
    id: {
      courseId: number;
    },
    query: $CourseAPI.GetCourseById.Query,
  ) => Promise<$CourseAPI.GetCourseById.Response["data"]>;
  getCourseInstructors: (
    user: UserModel,
    id: {
      courseId: number;
    },
    query: $CourseAPI.GetCourseInstructors.Query,
  ) => Promise<$CourseAPI.GetCourseInstructors.Response["data"]>;
  updateCourse: (
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourse.Dto,
  ) => Promise<CourseModel>;
  updateCourseStatus: (
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourseStatus.Dto,
  ) => Promise<CourseModel>;
  updateCourseCategoryId: (
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourseCategoryId.Dto,
  ) => Promise<CourseModel>;
  updateCourseCode: (
    id: {
      courseId: number;
      resourceId: CourseResourceId;
    },
    dto: $CourseAPI.UpdateCourseCode.Dto,
  ) => Promise<CourseModel>;
  deleteCourse: (id: {
    courseId: number;
    resourceId: CourseResourceId;
  }) => Promise<{}>;
  createLike: (id: {
    resourceId: CourseLikeResourceId;
  }) => Promise<CourseLikeModel>;
  deleteLike: (id: {
    likeId: number;
    resourceId: CourseLikeResourceId;
  }) => Promise<{}>;
}

export interface ICourseRepository {
  createCourse: (
    data: { authorId: number } & $CourseAPI.CreateCourse.Dto,
  ) => Promise<CourseModel>;
  getCourses: (
    query?: Partial<$CourseAPI.GetCourses.Query>,
  ) => Promise<$CourseAPI.GetCourses.Response["data"]>;
  getCourseInstructors: (
    id: {
      courseId: number;
    },
    query?: $CourseAPI.GetCourseInstructors.Query,
  ) => Promise<$CourseAPI.GetCourseInstructors.Response["data"]>;
  getCourseById: (
    id: {
      courseId: number;
    },
    query?: Partial<$CourseAPI.GetCourseById.Query>,
  ) => Promise<$CourseAPI.GetCourseById.Response["data"] | null>;
  getCourseByIdOrThrow: (
    id: {
      courseId: number;
    },
    query?: Partial<$CourseAPI.GetCourseById.Query>,
    error?: Error,
  ) => Promise<$CourseAPI.GetCourseById.Response["data"]>;
  updateCourse: (
    id: { courseId: number },
    data: Partial<CourseModel>,
  ) => Promise<CourseModel>;
  deleteCourse: (id: { courseId: number }) => Promise<{}>;
  createLike: (
    id: {
      courseId: number;
      resourceId?: Omit<CourseLikeResourceId["params"], "courseId">;
    },
    data: { userId: number } & $CourseAPI.CreateLike.Dto,
  ) => Promise<CourseLikeModel>;
  getLikeById: (id: {
    likeId: number;
    resourceId?: CourseLikeResourceId["params"];
  }) => Promise<CourseLikeModel | null>;
  getLikeByIdOrThrow: (
    id: { likeId: number; resourceId?: CourseLikeResourceId["params"] },
    error?: Error,
  ) => Promise<CourseLikeModel>;
  deleteLike: (id: {
    likeId: number;
    resourceId?: CourseLikeResourceId["params"];
  }) => Promise<{}>;
}
