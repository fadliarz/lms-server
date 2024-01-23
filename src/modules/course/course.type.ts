import { Course, CourseEnrollmentRole, CourseLike, Role } from "@prisma/client";
import { UserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { CourseCategoryModel } from "../category/category.type";

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for("COURSE_AUTHORIZATION_MIDDLEWARE"),
};

export enum courseUrls {
  root = "/courses",
  course = "/:courseId",
  likes = "/likes",
  like = "/likes/:likeId",
  category = "/categories",
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
export type CourseModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<Course>;
export type BasicCourseModel = Pick<
  CourseModel,
  "description" | "image" | "title" | "categoryId" | "material"
>;
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

/**
 * Dto GetCourseById
 */
type GetCourseByIdIncludeQuery = {
  include_author?: boolean;
  include_category?: boolean;
  include_students?: boolean;
  include_instructors?: boolean;
  include_playlist?: boolean;
};
type GetCourseByIdFilterQuery = {};
export type GetCourseByIdQuery = GetCourseByIdIncludeQuery &
  GetCourseByIdFilterQuery;

export type BasicUser = Pick<UserModel, "id" | "name" | "NIM" | "avatar">;
export type BasicCategory = Pick<CourseCategoryModel, "id" | "title">;
export type BasicCourseLesson = Pick<CourseLessonModel, "id" | "title">;
export type GetCourseByIdResBody<
  U = BasicUser,
  C = BasicCategory,
  L = BasicCourseLesson,
> = Course & {
  author?: U;
  students?: U[];
  instructors?: U[];
  category?: C;
  playlist?: L[];
};

/**
 * Dto GetCourses
 *
 */
export type GetCoursesQuery = Pick<
  GetCourseByIdIncludeQuery,
  "include_author" | "include_category"
> & { pageNumber: number; pageSize: number };

/**
 * Dto GetEnrolledCourseById
 *
 */
type GetEnrolledCourseByIdIncludeQuery = {
  include_author?: boolean;
  include_category?: boolean;
  include_students?: boolean;
  include_instructors?: boolean;
  include_playlist?: boolean;
};
type GetEnrolledCourseByIdFilterQuery = {
  role: CourseEnrollmentRole;
};
export type GetEnrolledCourseByIdQuery = GetEnrolledCourseByIdIncludeQuery &
  GetEnrolledCourseByIdFilterQuery;

/**
 * Dto GetEnrolledCourses
 *
 */
type GetEnrolledCoursesIncludeQuery = {
  include_author?: boolean;
  include_category?: boolean;
  include_student_courses?: boolean;
  include_instructor_courses?: boolean;
};
type GetEnrolledCoursesLimitQuery = {
  limit_student_courses: number;
  limit_instructor_courses: number;
};
export type GetEnrolledCoursesQuery = GetEnrolledCoursesIncludeQuery &
  GetEnrolledCoursesIncludeQuery &
  GetEnrolledCoursesLimitQuery;

/**
 * Dto UpdateCourse
 *
 */
export type UpdateCourseDto = Partial<
  CreateCourseDto & Pick<CourseModel, "status">
>;

/**
 * Dto CreateCourseLike
 *
 */
type CreateCourseLikeDtoRequiredField = {};
export type CreateCourseLikeDto = CreateCourseLikeDtoRequiredField;

/**
 * ResourceId CourseLike
 *
 */
export type CourseLikeResourceId = {
  courseId: number;
  likeId?: number;
};
