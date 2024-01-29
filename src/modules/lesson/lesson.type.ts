import { Course, CourseEnrollment, CourseLesson, User } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
};

export enum courseLessonUrls {
  root = "/lessons",
  lesson = "/:lessonId",
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
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
  authorizeUpdateLesson: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
  authorizeDeleteLesson: (
    user: User,
    course: Course,
    enrollment: CourseEnrollment | null,
  ) => void;
}

/**
 * Model CourseLesson
 *
 */
export type CourseLessonModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseLesson>;

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * Dto CreateCourseLesson
 *
 */
type CreateCourseLessonDtoRequiredField = Pick<CourseLessonModel, "title">;
type CreateCourseLessonDtoOptionalField = Partial<
  Pick<CourseLessonModel, "description">
>;
export type CreateCourseLessonDto = CreateCourseLessonDtoRequiredField &
  CreateCourseLessonDtoOptionalField;

/**
 * Dto UpdateCourseLesson
 *
 */
export type UpdateCourseLessonDto = Partial<CreateCourseLessonDto>;

/**
 * ResourceId CourseLesson
 *
 */
export type CourseLessonResourceId = {
  userId: number;
  courseId: number;
};
