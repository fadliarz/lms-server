import { CourseEnrollment, Prisma } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";
import { CourseEnrollmentRoleModel } from "../course/course.type";

export const CourseEnrollmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_ENROLLMENT_AUTHORIZATION"),
};

export enum courseEnrollmentUrls {
  root = "/enrollments",
  enrollment = "/:enrollmentId",
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
export type ValuableCourseEnrollmentModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseEnrollmentModel>;
export type BasicCourseEnrollmentModel = Pick<
  CourseEnrollmentModel,
  "userId" | "courseId" | "role"
>;

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
export type CreateCourseEnrollmentDto = Pick<
  CourseEnrollmentModel,
  "userId" | "role"
>;
export type UpdateCourseEnrollmentRoleDto = Pick<
  CreateCourseEnrollmentDto,
  "role"
>;

/**
 * ResourceId CourseEnrollment
 *
 */
export type CourseEnrollmentResourceId = {
  userId: number;
  courseId: number;
};
