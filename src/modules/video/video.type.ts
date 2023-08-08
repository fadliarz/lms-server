import { Course, CourseLessonVideo } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";

export type CourseLessonVideoModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLessonVideo>;

export type CourseLessonVideoDateKeys = "createdAt" | "updatedAt";
export type CourseLessonVideoHasDefaultValue = "";
export type ExcludeFromDto =
  | "id"
  | "totalDurations"
  | "courseLessonId"
  | CourseLessonVideoDateKeys;

export const CourseLessonVideoDITypes = {
  COURSE_LESSON_VIDEO_REPOSITORY: Symbol.for("COURSE_LESSON_VIDEO_REPOSITORY"),
  COURSE_LESSON_VIDEO_SERVICE: Symbol.for("COURSE_LESSON_VIDEO_SERVICE"),
  COURSE_LESSON_VIDEO_CONTROLLER: Symbol.for("COURSE_LESSON_VIDEO_CONTROLLER"),
};

export enum courseLessonVideoUrls {
  root = "/courses/:courseId/lessons/:lessonId/videos",
  video = "/:courseLessonVideoId",
}

/**
 * Dto
 */
export type CreateCourseLessonVideoDto = Omit<
  CourseLessonVideoModel,
  ExcludeFromDto
>;

/**
 * Query
 */
export type CourseLessonVideoParams = {
  courseId: string;
  lessonId: string;
};

export type UpdateCourseLessonVideoDto = Partial<CreateCourseLessonVideoDto>;
