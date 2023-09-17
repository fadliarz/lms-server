import { Course, CourseCategory } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
  MakePropertiesOptional,
} from "../../common/types";
import { UserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";

export type CourseModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<Course> & {
    category: CourseCategory;
  };
  
export type CourseCategoryModel = CourseCategory;
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
  | "category"
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
  likes = "/likes",
  like = "/likes/:likeId",
  category = "/categories",
}

/**
 * Dto
 */
export type CreateCourseDto = MakePropertiesOptional<
  Omit<CourseModel, ExcludeFromDto>,
  CourseHasDefaultValue
>;
export type UpdateCourseDto = Partial<CreateCourseDto>;
export type CreateCourseLikeDto = {
  courseId: number;
};

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
  include_student_courses?: string;
  include_instructor_courses?: string;
  include_owned_courses?: string;
  category_id?: string;
};

/**
 * Return
 */
export type GetCourseByIdDto<T = Enroller> = Course & {
  author?: T;
  students?: T[];
  instructors?: T[];
  lessons: CourseLessonModel[];
  category: CourseCategory;
};
export type Enroller = Pick<UserModel, "id" | "name" | "NIM" | "avatar">;

/**
 * Ids
 */
export type CreateCourseLikeIds = {
  courseId: number;
};
export type DeleteCourseLikeIds = {
  courseId: number;
};
