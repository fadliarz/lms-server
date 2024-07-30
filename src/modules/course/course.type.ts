import { PublicUserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";
import { CourseCategoryModel } from "../category/category.type";
import {
  CourseLessonVideoModel,
  PublicCourseLessonVideoModel,
} from "../video/video.type";

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
} as const;

export enum courseUrls {
  root = "/courses",
  course = "/:courseId",
  basic = courseUrls.course + "/basic",
  status = courseUrls.course + "/status",
  category = courseUrls.course + "/category",
  code = courseUrls.course + "/code",
  enrolled = "/enrolled",
  likes = "/:courseId/likes",
  like = courseUrls.likes + "/:likeId",
}

export enum CourseErrorMessage {
  COURSE_DOES_NOT_EXIST = "course doesn't exist!",
}

/**
 *
 *
 * Model
 *
 *
 */

export const UserRoleModel = {
  OWNER: "OWNER",
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
} as const;

export type UserRoleModel = (typeof UserRoleModel)[keyof typeof UserRoleModel];

export type CourseModel = {
  id: number;
  code: string;
  status: CourseStatusModel;
  image: string;
  title: string;
  description: string | null;
  material: string | null;
  totalStudents: number;
  totalInstructors: number;
  totalLessons: number;
  totalVideos: number;
  totalDurations: number;
  totalLikes: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  categoryId: number | null;
};

export type CourseLikeModel = {
  id: number;
  courseId: number;
  userId: number;
};

export type CourseStatusModel =
  (typeof CourseStatusModel)[keyof typeof CourseStatusModel];

export const CourseStatusModel = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
} as const;

export const CourseEnrollmentRoleModel = {
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
} as const;

export type CourseEnrollmentRoleModel =
  (typeof CourseEnrollmentRoleModel)[keyof typeof CourseEnrollmentRoleModel];

export type EnrolledCourseModel = {
  role: CourseEnrollmentRoleModel;
  course: CourseModel;
};

export type BasicCourseLessonModel = Pick<
  CourseLessonModel,
  "id" | "title" | "totalVideos" | "totalDurations"
>;
export type BasicCourseLessonVideoModel = Pick<
  CourseLessonVideoModel,
  "id" | "name" | "totalDurations"
>;
export type BasicCourseLessonExtension = BasicCourseLessonModel & {
  videos: BasicCourseLessonVideoModel[];
};

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
type CreateCourseDtoRequiredField = Pick<
  CourseModel,
  "title" | "categoryId" | "code"
>;
type CreateCourseDtoOptionalField = Partial<
  Pick<CourseModel, "image" | "description" | "material">
>;
export type CreateCourseDto = CreateCourseDtoRequiredField &
  CreateCourseDtoOptionalField;

export type CreateCourseLikeDto = {};

/**
 * Dto > Update
 *
 */
export type UpdateCourseDto = Partial<
  CreateCourseDto & Pick<CourseModel, "status">
>;

export type UpdateBasicCourseDto = {
  description?: string;
  image?: string;
  title?: string;
  material?: string;
};

export type UpdateCourseCodeDto = {
  code: string;
};

export type UpdateCourseStatusDto = {
  status: CourseStatusModel;
};

export type UpdateCourseCategoryIdDto = {
  categoryId: number;
};

/**
 *
 *
 * Query
 *
 *
 */

/**
 * Query > Get
 *
 */
export type GetCourseByIdQuery = {
  include_author: boolean;
  include_category: boolean;
  include_lessons: boolean;
  include_public_videos: boolean;
};

export type GetCoursesQuery = {
  /**
   * Include
   *
   */
  include_author: boolean;
  include_category: boolean;
  /**
   * Paging
   *
   */
  pageNumber: number;
  pageSize: number;
};

export type GetEnrolledCoursesQuery = {
  /**
   * Include
   *
   */
  include_author: boolean;
  include_category: boolean;
  role: CourseEnrollmentRoleModel[];
  /**
   * Limit
   *
   */
  limit_student_courses: number;
  limit_instructor_courses: number;
};

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
};

export type CourseLikeResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
  courseId: number;
};

/**
 *
 *
 * Data
 *
 *
 */

/**
 * Data > Get
 *
 */
export type GetCourseByIdData = CourseModel & {
  author?: PublicUserModel;
  lessons?:
    | CourseLessonModel[]
    | (CourseLessonModel & { videos: PublicCourseLessonVideoModel[] })[];
  category?: CourseCategoryModel | null;
};

export type GetCoursesData = Array<
  CourseModel & {
    author?: PublicUserModel;
    category?: CourseCategoryModel | null;
  }
>;

export type GetEnrolledCoursesData = Array<{
  role: CourseEnrollmentRoleModel;
  course: CourseModel & {
    author?: PublicUserModel;
    category?: CourseCategoryModel | null;
  };
}>;
