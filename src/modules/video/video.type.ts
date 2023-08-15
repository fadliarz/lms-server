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
  | "lessonId"
  | CourseLessonVideoDateKeys;

export const CourseLessonVideoDITypes = {
  REPOSITORY: Symbol.for("REPOSITORY"),
  SERVICE: Symbol.for("SERVICE"),
  CONTROLLER: Symbol.for("CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for("AUTHORIZATION_MIDDLEWARE"),
};

export enum courseLessonVideoUrls {
  root = "/courses/:courseId/lessons/:lessonId/videos",
  video = "/courses/:courseId/lessons/:lessonId/videos/:videoId",
}

/**
 * Dto
 */
export type CreateCourseLessonVideoDto = Omit<
  CourseLessonVideoModel,
  ExcludeFromDto
>;

export type UpdateCourseLessonVideoDto = Partial<CreateCourseLessonVideoDto>;

/**
 * Query
 */
export type CourseLessonVideoParams = {
  courseId: string;
  lessonId: string;
  videoId: string;
};
