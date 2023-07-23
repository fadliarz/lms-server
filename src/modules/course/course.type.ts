import { Course } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";

export type CourseModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<Course>;

export type CourseDateKeys = "createdAt" | "updatedAt";
export type CourseHasDefaultValue = "image";
export type ExcludeFromDto =
  | "id"
  | "totalStudents"
  | "totalPlaylists"
  | "totalHours"
  | CourseDateKeys;

export const CourseDITypes = {
  COURSE_REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  COURSE_SERVICE: Symbol.for("COURSE_SERVICE"),
  COURSE_CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
};

export enum courseUrls {
  root = "/course",
  create = "/create",
  getAll = "/get",
  getOne = "/get/:courseId",
  update = "/update/:courseId",
}

/**
 * Dto
 */
export type CreateCourseDto = MakePropertiesOptional<
  Omit<CourseModel, ExcludeFromDto>,
  CourseHasDefaultValue
>;
export type UpdateCourseDto = Partial<CreateCourseDto>;
