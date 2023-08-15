import { Course } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";
import { BaseUserProfile } from "../user/user.type";

export type CourseModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<Course>;

export type CourseDateKeys = "createdAt" | "updatedAt";
export type CourseHasDefaultValue = "image";
export type ExcludeFromDto =
  | "id"
  | "totalStudents"
  | "totalInstructors"
  | "totalLessons"
  | "totalDurations"
  | "totalLikes"
  | "authorId"
  | CourseDateKeys;

export const CourseDITypes = {
  REPOSITORY: Symbol.for("REPOSITORY"),
  SERVICE: Symbol.for("SERVICE"),
  CONTROLLER: Symbol.for("CONTROLLER"),
  AUTHORIZATION_MIDDLEWARE: Symbol.for("AUTHORIZATION_MIDDLEWARE"),
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
};

export type Enroller = {
  profile: BaseUserProfile | null;
};

export type CourseEnrollmentSelect = {
  role?: boolean;
  userId?: boolean;
  courseId?: boolean;
};
