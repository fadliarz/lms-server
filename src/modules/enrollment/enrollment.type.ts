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
