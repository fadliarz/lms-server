import { CourseModel, UserRoleModel } from "../course/course.type";
import { UserModel } from "../user/user.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";

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
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeGetVideo: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeGetVideos: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeUpdateVideo: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteVideo: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
}

/**
 *
 *
 * Model
 *
 *
 */
export type CourseLessonVideoModel = {
  id: number;
  name: string;
  description: string | null;
  totalDurations: number;
  youtubeLink: string;
  createdAt: Date;
  updatedAt: Date;
  lessonId: number;
};
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
