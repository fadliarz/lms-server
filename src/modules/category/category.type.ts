import { CourseCategory } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export const CourseCategoryDITypes = {
  REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
};
export enum courseCategoryUrls {
  root = "/categories",
  category = "/:categoryId",
}

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
 * CreateCourseCategory
 *
 */
export type CreateCourseCategoryDto = {
  title: string;
};

/**
 * UpdateCourseCategoryDto
 *
 */
export type UpdateCourseCategoryDto = Partial<CreateCourseCategoryDto>;
