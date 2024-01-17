import { CourseLessonVideo } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export const CourseLessonVideoDITypes = {
  REPOSITORY: Symbol.for("COURSE_VIDEO_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_VIDEO_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_VIDEO_CONTROLLER"),
};
export enum courseLessonVideoUrls {
  root = "/courses/:courseId/lessons/:lessonId/videos",
  video = courseLessonVideoUrls.root + "/:videoId",
}

/**
 *
 *
 * Model
 *
 *
 */
export type CourseLessonVideoModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLessonVideo>;

/**
 *
 *
 * Dto
 *
 *
 */
type CreateCourseLessonVideoRequiredField = Pick<
  CourseLessonVideoModel,
  "name" | "youtubeLink" | "totalDurations"
>;
type CreateCourseLessonVideoOptionalField = Pick<
  CourseLessonVideoModel,
  "description"
>;
export type CreateCourseLessonVideoDto = CreateCourseLessonVideoRequiredField &
  CreateCourseLessonVideoOptionalField;
export type UpdateCourseLessonVideoDto = Partial<CreateCourseLessonVideoDto>;

/**
 * ResourceId CourseLessonVideo
 *
 */
export type CourseLessonVideoResourceId = {
  courseId: number;
  lessonId: number;
  videoId: number;
};
