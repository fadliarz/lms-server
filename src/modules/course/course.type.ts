import { Course } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export type CourseModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<Course>;
export type CourseDateKeys = "createdAt" | "updatedAt";

export const CourseDITypes = {
  COURSE_REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  COURSE_SERVICE: Symbol.for("COURSE_SERVICE"),
  COURSE_CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
};

export enum courseUrls {
  root = "/course",
  create = "/create",
  update = "/update/:courseId"
}

/**
 * Dto
 */
export type CreateCourseDto = Omit<
  CourseModel,
  "id" | "authorId" | "studentsCount" | CourseDateKeys
>;
export type UpdateCourseDto = Partial<CreateCourseDto>;
