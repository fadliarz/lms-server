import { CourseLesson } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
export type CourseLessonModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLesson>;

type CourseLessonDateKeys = "createdAt" | "updatedAt";
type CourseLessonHasDefaultValue = "";
type ExcludeFromDto =
  | "id"
  | "totalDurations"
  | "totalMaterials"
  | CourseLessonDateKeys;
export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("REPOSITORY"),
  SERVICE: Symbol.for("SERVICE"),
  CONTROLLER: Symbol.for("CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for("AUTHORIZATION_MIDDLEWARE")
};
export enum courseLessonUrls {
  root = "/courses/:courseId/lessons",
  lesson = "/courses/:courseId/lessons/:lessonId",
}

/**
 * Dto
 */
export type CreateCourseLessonDto = Omit<
  CourseLessonModel,
  ExcludeFromDto | "courseId"
>;
export type UpdateCourseLessonDto = Partial<CreateCourseLessonDto>;
