import { CourseEnrollmentRoleModel } from "../course/course.type";
import { UserModel } from "../user/user.type";

export const CourseEnrollmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_ENROLLMENT_AUTHORIZATION"),
} as const;

export type CourseEnrollmentModel = {
  id: number;
  userId: number;
  courseId: number;
  classId: number | null;
  role: CourseEnrollmentRoleModel;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseEnrollmentResourceId = {
  user: UserModel;
  params: {
    courseId: number;
  };
};
