import { CourseEnrollment } from "@prisma/client";
import { CourseEnrollmentRoleModel } from "../course/course.type";

export const CourseEnrollmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_ENROLLMENT_AUTHORIZATION"),
};

export enum courseEnrollmentUrls {
  root = "/courses/:courseId/enrollments",
  enrollment = courseEnrollmentUrls.root + "/:enrollmentId",
  role = courseEnrollmentUrls.enrollment + "/role",
}

export enum CourseEnrollmentErrorMessage {
  ENROLLMENT_DOES_NOT_EXIST = "enrollment doesn't exist!",
  UNEXPECTED_SCENARIO = "unexpected scenario, please submit a ticket!",
  STUDENT_SHOULD_NOT_ENROLLED_AS_INSTRUCTOR = "user with role STUDENT can't be enrolled as INSTRUCTOR on a course!",
  AUTHOR_SHOULD_NOT_BE_ENROLLED = "author should not be enrolled!",
  TARGET_USER_DOES_NOT_EXIST = "target user doesn't exist!",
  TARGET_USER_IS_ALREADY_ENROLLED = "target user is already enrolled!",
}

/**
 *
 *
 * Model
 *
 *
 */
export type CourseEnrollmentModel = CourseEnrollment;

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * Dto CreateEnrollment
 *
 */
export type CreateCourseEnrollmentDto = {
  userId: number;
  role: CourseEnrollmentRoleModel;
};

export type UpdateCourseEnrollmentRoleDto = {
  role: CourseEnrollmentRoleModel;
};

/**
 * ResourceId CourseEnrollment
 *
 */
export type CourseEnrollmentResourceId = {
  userId: number;
  courseId: number;
};
