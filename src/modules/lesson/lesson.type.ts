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
  | "totalVideos"
  | CourseLessonDateKeys;

export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for(
    "COURSE_LESSON_AUTHORIZATION_MIDDLEWARE"
  ),
};

export enum courseLessonUrls {
  root = "/lessons",
  lesson = "/:lessonId",
}

/**
 * Dto
 */
export type CreateCourseLessonDto = Omit<CourseLessonModel, ExcludeFromDto>;
export type UpdateCourseLessonDto = Partial<
  Omit<CreateCourseLessonDto, "courseId">
>;
