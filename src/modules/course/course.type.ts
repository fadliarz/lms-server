import { Course } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";
import { BaseUserProfile, UserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";
export type CourseModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<Course>;

export type CourseDateKeys = "createdAt" | "updatedAt";
export type CourseHasDefaultValue = "image";
export type ExcludeFromDto =
  | "id"
  | "totalStudents"
  | "totalInstructors"
  | "totalLessons"
  | "totalVideos"
  | "totalDurations"
  | "totalLikes"
  | "authorId"
  | CourseDateKeys;

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for("COURSE_AUTHORIZATION_MIDDLEWARE"),
};

export enum courseUrls {
  root = "/courses",
  course = "/:courseId",
  likes = "/:courseId/likes",
  like = "/:courseId/likes/:likeId",
}

/**
 * Dto
 */
export type CreateCourseDto = MakePropertiesOptional<
  Omit<CourseModel, ExcludeFromDto>,
  CourseHasDefaultValue
>;
export type UpdateCourseDto = Partial<CreateCourseDto>;

/**
 * Query
 */
export type GetCourseQuery = {
  include_students?: string;
  include_instructors?: string;
  include_lessons?: string;
  include_videos?: string;
  include_author?: string;
};

export type GetCoursesQuery = {
  include_student_course?: string;
  include_instructor_course?: string;
  include_owned?: string;
};

/**
 * Return
 */
export type GetCourseByIdDto<T = Enroller> = Course & {
  author?: T;
  students?: T[];
  instructors?: T[];
  lessons: CourseLessonModel[];
};

export type Enroller = Pick<UserModel, "id" | "name" | "NIM" | "avatar">;
