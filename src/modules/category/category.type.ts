import { Course, CourseCategory, CourseEnrollment, User } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export const CourseCategoryDITypes = {
  REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CATEGORY_AUTHORIZATION"),
};

export enum courseCategoryUrls {
  root = "/categories",
  category = "/:categoryId",
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
export interface ICourseCategoryAuthorization {
  authorizeCreateCategory: (user: User) => void;
  authorizeUpdateCategory: (user: User) => void;
}

/**
 *
 *
 * Model
 *
 *
 */

/**
 * Model CourseCategory
 *
 */
export type CourseCategoryModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseCategory>;
export type BasicCourseCategoryModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseCategoryModel>;

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * Dto CreateCourseCategory
 *
 */
export type CreateCourseCategoryDto = {
  title: string;
};

/**
 * Dto UpdateCourseCategoryDto
 *
 */
export type UpdateCourseCategoryDto = Partial<CreateCourseCategoryDto>;

/**
 * ResourceId CourseLessonVideo
 *
 */
export type CourseCategoryResourceId = {
  userId: number;
};
