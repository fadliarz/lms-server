import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/shared.types";
import { UserRoleModel } from "../course/course.type";

export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
} as const;

export enum courseLessonUrls {
  lessons = "/courses/:courseId/lessons",
  lesson = courseLessonUrls.lessons + "/:lessonId",
  basic = courseLessonUrls.lesson + "/basic",
}

/**
 *
 *
 * Model
 *
 *
 */

export type CourseLessonModel = {
  id: number;
  title: string;
  description: string | null;
  totalVideos: number;
  totalDurations: number;
  totalMaterials: number;
  createdAt: Date;
  updatedAt: Date;
  courseId: number;
};
export type ValuableCourseLessonModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLessonModel>;

/**
 *
 *
 * Dto
 *
 *
 */

export type CreateCourseLessonDto = {
  title: string;
  description?: string;
};

export type UpdateBasicCourseLessonDto = Partial<CreateCourseLessonDto>;

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseLessonResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
  courseId: number;
};
