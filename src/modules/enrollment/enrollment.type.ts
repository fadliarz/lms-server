import { CourseEnrollment } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export type CourseEnrollmentModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseEnrollment>;
export type CourseEnrollmentDateKeys = "createdAt" | "updatedAt";
export type CourseEnrollmentHasDefaultValue = "";
export type ExcludeFromDto = "id" | CourseEnrollmentDateKeys;
export const CourseEnrollmentDITypes = {
  REPOSITORY: Symbol.for("REPOSITORY"),
  SERVICE: Symbol.for("SERVICE"),
  CONTROLLER: Symbol.for("CONTROLLER"),
  AUTHORIZATION_MIDDLEARE: Symbol.for("AUTHORIZATION_MIDDLEWARE"),
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

export type UpdateCourseEnrollmentDto = Pick<CreateCourseEnrollmentDto, "role">;

/**
 * Query
 */
export type CourseEnrollmentParams = {};
