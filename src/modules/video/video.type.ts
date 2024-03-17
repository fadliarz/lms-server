import {
  Course,
  CourseEnrollment,
  CourseLessonVideo,
  User,
} from "@prisma/client";
import { UserRoleModel } from "../course/course.type";

export const CourseLessonVideoDITypes = {
  REPOSITORY: Symbol.for("COURSE_VIDEO_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_VIDEO_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_VIDEO_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_VIDEO_AUTHORIZATION"),
};

export enum courseLessonVideoUrls {
  root = "/courses/:courseId/lessons/:lessonId/videos",
  video = courseLessonVideoUrls.root + "/:videoId",
  basic = courseLessonVideoUrls.video + "/basic",
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
  authorizeGetVideos: (
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

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * Dto > Create
 *
 */
export type CreateCourseLessonVideoDto = {
  name: string;
  youtubeLink: string;
  totalDurations: number;
} & {
  description?: string;
};

/**
 * Dto > Update
 *
 */
export type UpdateBasicCourseLessonVideoDto = {
  name?: string;
  description?: string;
};

export type UpdateCourseLessonVideoSourceDto = {
  youtubeLink: string;
  totalDurations: number;
};

/**
 * ResourceId CourseLessonVideo
 *
 */
export type CourseLessonVideoResourceId = {
  user: { id: number; role: UserRoleModel };
  courseId: number;
  lessonId: number;
};
