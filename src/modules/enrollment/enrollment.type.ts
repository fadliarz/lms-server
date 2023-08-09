import { CourseEnrollment } from "@prisma/client";
import {
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
} from "../../common/types";

export type CourseEnrollmentModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseEnrollment>;

export type CourseEnrollmentDateKeys = "createdAt" | "updatedAt";
export type CourseEnrollmentHasDefaultValue = "";
export type ExcludeFromDto = "id" | CourseEnrollmentDateKeys;

export const CourseEnrollmentDITypes = {
  COURSE_ENROLLMENT_REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
  COURSE_ENROLLMENT_SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
  COURSE_ENROLLMENT_CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
};

export enum courseEnrollmentUrls {
  root = "/courses/:courseId/enrollment",
  enrollment = "/courses/:courseId/enrollment/:enrollmentId",
}

/**
 * Dto
 */
export type CreateCourseEnrollmentDto = Omit<
  CourseEnrollmentModel,
  ExcludeFromDto
>;

export type UpdateCourseEnrollmentDto = Partial<CreateCourseEnrollmentDto>;

/**
 * Query
 */
export type CourseEnrollmentParams = {

};
