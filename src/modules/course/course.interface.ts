import { UserModel } from "../user/user.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import {
  CourseLikeModel,
  CourseLikeResourceId,
  CourseModel,
  CourseResourceId,
  CreateCourseDto,
  GetCourseByIdData,
  GetCourseByIdQuery,
  GetCoursesData,
  GetCoursesQuery,
  GetEnrolledCoursesData,
  GetEnrolledCoursesQuery,
  UpdateBasicCourseDto,
  UpdateCourseCategoryIdDto,
  UpdateCourseCodeDto,
  UpdateCourseDto,
  UpdateCourseStatusDto,
} from "./course.type";
import { NextFunction, Request, Response } from "express-serve-static-core";

export interface ICourseAuthorization {
  authorizeCreateCourse: (user: UserModel) => void;
  authorizeUpdateBasicCourse: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteCourse: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeCreateLike: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteLike: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
}

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
  getEnrolledCourses: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateBasicCourse: (
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
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ) => Promise<CourseModel>;
  getCourseById: (
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ) => Promise<GetCourseByIdData>;
  getCourses: (query: GetCoursesQuery) => Promise<GetCoursesData>;
  getEnrolledCourses: (
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ) => Promise<GetEnrolledCoursesData>;
  updateBasicCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateBasicCourseDto,
  ) => Promise<CourseModel>;
  updateCourseStatus: (
    courseId: number,
    resourceID: CourseResourceId,
    dto: UpdateCourseStatusDto,
  ) => Promise<CourseModel>;
  updateCourseCategoryId: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseCategoryIdDto,
  ) => Promise<CourseModel>;
  updateCourseCode: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseCodeDto,
  ) => Promise<CourseModel>;
  deleteCourse: (courseId: number, resourceId: CourseResourceId) => Promise<{}>;
  createLike: (resourceId: CourseLikeResourceId) => Promise<CourseLikeModel>;
  deleteLike: (likeId: number, resourceId: CourseLikeResourceId) => Promise<{}>;
  validateRelationBetweenResources: (
    id: {
      likeId: number;
      resourceId: CourseLikeResourceId;
    },
    error?: Error,
  ) => Promise<CourseLikeModel | null>;
}

export interface ICourseRepository {
  createCourse: (
    resourceId: CourseResourceId,
    dto: CreateCourseDto,
  ) => Promise<CourseModel>;
  getCourseById: (
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
  ) => Promise<GetCourseByIdData | null>;
  getCourseByIdOrThrow: (
    courseId: number,
    resourceId: CourseResourceId,
    query: GetCourseByIdQuery,
    error?: Error,
  ) => Promise<CourseModel>;
  getCourses: (query: GetCoursesQuery) => Promise<GetCoursesData>;
  getEnrolledCourses: (
    resourceId: CourseResourceId,
    query: GetEnrolledCoursesQuery,
  ) => Promise<GetEnrolledCoursesData>;
  updateCourse: (
    courseId: number,
    resourceId: CourseResourceId,
    dto: UpdateCourseDto,
  ) => Promise<CourseModel>;
  deleteCourse: (courseId: number, resourceId: CourseResourceId) => Promise<{}>;
  createLike: (resourceId: CourseLikeResourceId) => Promise<CourseLikeModel>;
  getLikeById: (
    likeId: number,
    resourceId: CourseLikeResourceId,
  ) => Promise<CourseLikeModel | null>;
  getLikeByIdOrThrow: (
    likeId: number,
    resourceId: CourseLikeResourceId,
    error?: Error,
  ) => Promise<CourseLikeModel>;
  deleteLike: (likeId: number, resourceId: CourseLikeResourceId) => Promise<{}>;
}
