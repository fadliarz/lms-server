import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { UserModel } from "../user/user.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { CourseModel, UserRoleModel } from "../course/course.type";

export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
};

export enum courseLessonUrls {
  lessons = "/courses/:courseId/lessons",
  lesson = courseLessonUrls.lessons + "/:lessonId",
  basic = courseLessonUrls.lesson + "/basic",
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
export interface ICourseLessonAuthorization {
  authorizeCreateLesson: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeUpdateLesson: (
    user: UserModel,
    course: CourseModel,
    enrollment: CourseEnrollmentModel | null,
  ) => void;
  authorizeDeleteLesson: (
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

/**
 * Model CourseLesson
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

/**
 * Dto > Create
 *
 */
export type CreateCourseLessonDto = {
  title: string;
  description?: string;
};

/**
 * Dto > Update
 *
 */
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
