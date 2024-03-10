import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { UserModel } from "../user/user.type";
import { CourseEnrollmentModel } from "../enrollment/enrollment.type";
import { CourseModel } from "../course/course.type";
import { CourseLesson } from "@prisma/client";

export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
};

export enum courseLessonUrls {
  root = "/courses/:courseId/lessons",
  lesson = "/courses/:courseId/lessons/:lessonId",
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
export type CourseLessonModel = CourseLesson;
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
 *
 *
 * ResourceId
 *
 *
 */

/**
 * ResourceId CourseLesson
 *
 */
export type CourseLessonResourceId = {
  userId: number;
  courseId: number;
};
