import { CourseLessonVideo } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export type CourseLessonVideoModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLessonVideo>;

export type CourseLessonVideoDateKeys = "createdAt" | "updatedAt";
export type CourseLessonVideoHasDefaultValue = "";
export type ExcludeFromDto = "id" | CourseLessonVideoDateKeys;

export const CourseLessonVideoDITypes = {
  REPOSITORY: Symbol.for("COURSE_VIDEO_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_VIDEO_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_VIDEO_CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for("COURSE_VIDEO_AUTHORIZATION_MIDDLEWARE"),
};

export enum courseLessonVideoUrls {
  root = "/videos",
  video = "/:videoId",
}

/**
 * Dto
 */
export type CreateCourseLessonVideoDto = Omit<
  CourseLessonVideoModel,
  ExcludeFromDto
>;

export type UpdateCourseLessonVideoDto = Partial<
  Omit<CreateCourseLessonVideoDto, "lessonId">
>;

/**
 * Ids
 */
export type CreateCourseLessonVideoIds = {
  lessonId: number;
  courseId: number;
};
export type UpdateCourseLessonVideoIds = CreateCourseLessonVideoIds & {
  videoId: number;
};
export type DeleteCourseLessonVideoIds = CreateCourseLessonVideoIds & {
  videoId: number;
};
