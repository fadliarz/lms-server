import { CourseLesson } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";

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
  COURSE_LESSON_REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  COURSE_LESSON_SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  COURSE_LESSON_CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
};

export enum courseLessonUrls {
  root = "/courses/:courseId/lessons",
  lesson = "/:lessonId"
}

/**
 * Dto
 */
export type CreateCourseLessonDto = Omit<
  CourseLessonModel,
  ExcludeFromDto | "courseId"
>;

export type UpdateCourseLessonDto = Partial<CreateCourseLessonDto>;

/**
 * Query & Params
 */
export type CourseLessonParams = {
  courseId: string;
  lessonId: string;
};
