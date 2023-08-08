import { Course } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";

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
  COURSE_REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  COURSE_SERVICE: Symbol.for("COURSE_SERVICE"),
  COURSE_CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
};

export enum courseUrls {
  root = "/courses",
  course = "/:courseId",
  likes = "/:courseId/likes",
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
export type GetCoursesQuery = {
  role: "OWNER" | "INSTRUCTOR" | "STUDENT";
};

export type GetCourseQuery = {
  include_students?: string;
  include_instructors?: string;
  include_lessons?: string;
};

/**
 * Return
 */
export type GetOneCourse<T = Enroller> = Course & {
  author?: T;
  students?: T[];
  instructors?: T[];
};

export type Enroller = {
  id: string;
  profile: {
    name: string;
    NIM: string;
  } | null;
};
