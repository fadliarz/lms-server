import {
  Course,
  CourseEnrollmentRole,
  CourseLike,
  CourseStatus,
  Role,
} from "@prisma/client";
import { PublicUserModel, UserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { CourseCategoryModel } from "../category/category.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import {
  CourseLessonVideoModel,
  PublicCourseLessonVideoModel,
} from "../video/video.type";

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
};

export enum courseUrls {
  root = "/courses",
  course = "/:courseId",
  basic = courseUrls.course + "/basic",
  status = courseUrls.course + "/status",
  category = courseUrls.course + "/category",
  enrolled = "/enrolled",
  likes = "/:courseId/likes",
  like = courseUrls.likes + "/:likeId",
}

/**
 *
 *
 * Interface
 *
 *
 */

/**
 * Interface Authorization
 *
 */
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

/**
 *
 *
 * Model
 *
 *
 */

export type UserRoleModel = Role;
export const UserRoleModel = Role;

export type CourseModel = Course;
export type CourseLikeModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLike>;
export type CourseStatusModel = CourseStatus;
export const CourseStatusModel = CourseStatus;
export type CourseEnrollmentRoleModel = CourseEnrollmentRole;
export const CourseEnrollmentRoleModel = CourseEnrollmentRole;

export type EnrolledCourseModel = {
  role: CourseEnrollmentRole;
  course: CourseModel;
};

export type BasicCourseLessonModel = Pick<
  CourseLessonModel,
  "id" | "title" | "totalVideos" | "totalDurations"
>;
export type BasicCourseLessonVideoModel = Pick<
  CourseLessonVideoModel,
  "id" | "name" | "totalDurations"
>;
export type BasicCourseLessonExtension = BasicCourseLessonModel & {
  videos: BasicCourseLessonVideoModel[];
};

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * Dto > Create
 *
 */
type CreateCourseDtoRequiredField = Pick<CourseModel, "title" | "categoryId">;
type CreateCourseDtoOptionalField = Partial<
  Pick<CourseModel, "image" | "description" | "material">
>;
export type CreateCourseDto = CreateCourseDtoRequiredField &
  CreateCourseDtoOptionalField;

export type CreateCourseLikeDto = {};

/**
 * Dto > Update
 *
 */
export type UpdateCourseDto = Partial<
  CreateCourseDto & Pick<CourseModel, "status">
>;

export type UpdateBasicCourseDto = {
  description?: string;
  image?: string;
  title?: string;
  material?: string;
};

export type UpdateCourseStatusDto = {
  status: CourseStatusModel;
};

export type UpdateCourseCategoryIdDto = {
  categoryId: number;
};

/**
 *
 *
 * Query
 *
 *
 */

/**
 * Query > Get
 *
 */
export type GetCourseByIdQuery = {
  include_author: boolean;
  include_category: boolean;
  include_lessons: boolean;
  include_public_videos: boolean;
};

export type GetCoursesQuery = {
  /**
   * Include
   *
   */
  include_author: boolean;
  include_category: boolean;
  /**
   * Paging
   *
   */
  pageNumber: number;
  pageSize: number;
};

export type GetEnrolledCoursesQuery = {
  /**
   * Include
   *
   */
  include_author: boolean;
  include_category: boolean;
  role: CourseEnrollmentRoleModel[];
  /**
   * Limit
   *
   */
  limit_student_courses: number;
  limit_instructor_courses: number;
};

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseResourceId = {
  userId: number;
};

export type CourseLikeResourceId = {
  userId: number;
  courseId: number;
};

/**
 *
 *
 * Data
 *
 *
 */

/**
 * Data > Get
 *
 */
export type GetCourseByIdData = CourseModel & {
  author?: PublicUserModel;
  lessons?:
    | CourseLessonModel[]
    | (CourseLessonModel & { videos: PublicCourseLessonVideoModel[] })[];
  category?: CourseCategoryModel;
};

export type GetCoursesData = Array<
  CourseModel & {
    author?: PublicUserModel;
    category?: CourseCategoryModel;
  }
>;

export type GetEnrolledCoursesData = Array<{
  role: CourseEnrollmentRoleModel;
  course: CourseModel & {
    author?: PublicUserModel;
    category?: CourseCategoryModel;
  };
}>;
