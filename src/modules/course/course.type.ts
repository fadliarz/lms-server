import { UserModel } from "../user/user.type";

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
} as const;

export const UserRoleModel = {
  ADMIN: "ADMIN",
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
  totalStudents: number;
  totalInstructors: number;
  totalLessons: number;
  totalVideos: number;
  totalAttachments: number;
  totalDurations: number;
  totalLikes: number;
  createdAt: Date;
  updatedAt: Date;
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

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseResourceId = {
  user: UserModel;
};

export type CourseLikeResourceId = {
  user: UserModel;
  params: { courseId: number };
};
