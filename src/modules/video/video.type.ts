import {
  Course,
  CourseEnrollment,
  CourseLessonVideo,
  User,
} from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { CourseLessonModel } from "../lesson/lesson.type";

export const CourseLessonVideoDITypes = {
  REPOSITORY: Symbol.for("COURSE_VIDEO_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_VIDEO_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_VIDEO_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_VIDEO_AUTHORIZATION"),
};

export enum courseLessonVideoUrls {
  root = "/courses/:courseId/lessons/:lessonId/videos",
  video = "/:videoId",
  source = courseLessonVideoUrls.video + "/source",
}

/**
 *
 *
 * Interface
 *
 *
 */

/**
 * Interface Authorization
 *
 */
export interface ICourseLessonVideoAuthorization {
  authorizeCreateVideo: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
  authorizeGetVideo: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
  authorizeUpdateVideo: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
  authorizeDeleteVideo: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
}

/**
 *
 *
 * Model
 *
 *
 */
export type CourseLessonVideoModel = CourseLessonVideo;
export type PublicCourseLessonVideoModel = Omit<
  CourseLessonVideoModel,
  "youtubeLink"
>;
export type ValuableCourseLessonVideoModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLessonModel>;

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
export type UpdateCourseLessonVideoSourceDto = {
  youtubeLink: string;
  totalDurations: number;
} & {
  name?: string;
  description?: string;
};

/**
 * ResourceId CourseLessonVideo
 *
 */
export type CourseLessonVideoResourceId = {
  userId: number;
  courseId: number;
  lessonId: number;
};
