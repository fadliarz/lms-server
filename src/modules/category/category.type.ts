import { CourseCategory, User } from "@prisma/client";
import { UserRoleModel } from "../course/course.type";

export const CourseCategoryDITypes = {
  REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CATEGORY_AUTHORIZATION"),
};

export enum courseCategoryUrls {
  root = "/categories",
  category = "/:categoryId",
  basic = courseCategoryUrls.category + "/basic",
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
export type CourseCategoryModel = CourseCategory;

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
export type CreateCourseCategoryDto = {
  title: string;
};

/**
 * Dto > Update
 *
 */
export type UpdateBasicCourseCategoryDto = {
  title?: string;
};

/**
 * ResourceId CourseLessonVideo
 *
 */
export type CourseCategoryResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
};
