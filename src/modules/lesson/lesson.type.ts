import { CourseLesson } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
};

export enum courseLessonUrls {
  root = "/lessons",
  lesson = "/:lessonId",
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
  courseId: number;
};
