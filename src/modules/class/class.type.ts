import { UserRoleModel } from "../course/course.type";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/shared.types";

export const CourseClassDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_AUTHORIZATION"),
} as const;

export enum courseClassUrls {
  root = "/courses/:courseId/classes",
  class = courseClassUrls.root + "/:classId",
}

export enum CourseClassErrorMessage {
  CLASS_DOES_NOT_EXIST = "class doesn't exist!",
}

export type CourseClassModel = {
  id: number;
  title: string;
  courseId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ValuableCourseClassModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseClassModel>;

/**
 *
 *
 * Dto
 *
 *
 */

export type CreateCourseClassDto = {
  title: string;
};

export type UpdateCourseClassDto = {
  title?: string;
};

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseClassResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
  courseId: number;
};
