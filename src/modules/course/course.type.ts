import { Course, CourseEnrollmentRole, CourseLike, Role } from "@prisma/client";
import { UserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { CourseCategoryModel } from "../category/category.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { CourseLessonVideoModel } from "../video/video.type";

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
};

export enum courseUrls {
  root = "/courses",
  enrolled = "enrolled",
  course = "/:courseId",
  likes = "/likes",
  like = "/likes/:likeId",
  category = "/categories",
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

/**
 * Model Course
 *
 */
export type CourseModel = Course;
export type ValuableCourseModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseModel>;

export type UserRoleModel = Role;
export const UserRoleModel = Role;
export type CourseEnrollmentRoleModel = CourseEnrollmentRole;
export const CourseEnrollmentRoleModel = CourseEnrollmentRole;

/**
 * Model CourseLike
 *
 */
export type CourseLikeModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLike>;

/**
 * Model Enrolled Course
 *
 */
export type EnrolledCourseModel = {
  role: CourseEnrollmentRole;
  course: CourseModel;
};

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * Dto CreateCourse
 *
 */
type CreateCourseDtoRequiredField = Pick<CourseModel, "title" | "categoryId">;
type CreateCourseDtoOptionalField = Partial<
  Pick<CourseModel, "image" | "description" | "material">
>;
export type CreateCourseDto = CreateCourseDtoRequiredField &
  CreateCourseDtoOptionalField;

export type BasicUser = Pick<UserModel, "id" | "avatar" | "name" | "NIM">;
export type BasicCourseLesson = Pick<
  CourseLessonModel,
  "id" | "title" | "totalVideos" | "totalDurations"
>;
export type BasicCourseLessonVideo = Pick<
  CourseLessonVideoModel,
  "id" | "name" | "totalDurations"
>;
export type BasicCourseLessonExtension = BasicCourseLesson & {
  videos: BasicCourseLessonVideo[];
};

/**
 * Dto GetCourseById
 *
 */
export type GetCourseByIdQuery = {
  include_author: boolean;
  include_category: boolean;
};

/**
 * Dto GetCourses
 *
 */
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

/**
 * Dto GetEnrolledCourses
 *
 */
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
 * Dto UpdateCourse
 *
 */
export type UpdateCourseDto = Partial<
  CreateCourseDto & Pick<CourseModel, "status">
>;
export type UpdateBasicCourseDto = Partial<
  Pick<
    ValuableCourseModel,
    "description" | "image" | "title" | "categoryId" | "material"
  >
>;

/**
 * Dto CreateCourseLike
 *
 */
type CreateCourseLikeDtoRequiredField = {};
export type CreateCourseLikeDto = CreateCourseLikeDtoRequiredField;

/**
 *
 *
 * ResourceId
 *
 *
 */

/**
 * ResourceId Course
 *
 */
export type CourseResourceId = {
  userId: number;
};

/**
 * ResourceId CourseLike
 *
 */
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
 * Data GetCourseById
 *
 */
export type GetCourseByIdData = CourseModel & {
  author?: BasicUser;
  lessons?: BasicCourseLesson[] | BasicCourseLessonExtension[];
  category?: CourseCategoryModel;
};

/**
 * Data GetEnrolledCourses
 *
 */
export type GetEnrolledCoursesData = (CourseModel & {
  role: CourseEnrollmentRoleModel;
  author?: Pick<UserModel, "id" | "avatar" | "name" | "NIM">;
  category?: CourseCategoryModel;
})[];
