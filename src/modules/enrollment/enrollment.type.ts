import { CourseEnrollment, Prisma } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export type CourseEnrollmentModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseEnrollment>;
export type CourseEnrollmentDateKeys = "createdAt" | "updatedAt";
export type CourseEnrollmentHasDefaultValue = "";
export type ExcludeFromDto = "id" | CourseEnrollmentDateKeys | "courseId";
export const CourseEnrollmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION_MIDDLEARE: Symbol.for(
    "COURSE_ENROLLMENT_AUTHORIZATION_MIDDLEWARE"
  ),
};
export enum courseEnrollmentUrls {
  root = "/enrollments",
  enrollment = "/:enrollmentId",
}

/**
 * Dto
 */
export type CreateCourseEnrollmentDto = Omit<
  CourseEnrollmentModel,
  ExcludeFromDto
>;

export type UpdateCourseEnrollmentDto = CreateCourseEnrollmentDto;

/**
 * Select
 */
export type CourseEnrollmentSelect = Pick<
  Prisma.CourseEnrollmentSelect,
  keyof CourseEnrollment
>;
