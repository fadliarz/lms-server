import { UserRoleModel } from "../course/course.type";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/shared.types";

export const CourseClassAssignmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_ASSIGNMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_ASSIGNMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_ASSIGNMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_ASSIGNMENT_AUTHORIZATION"),
} as const;

export enum courseClassAssignmentUrls {
  root = "/courses/:courseId/classes/:classId/assignments",
  assignment = courseClassAssignmentUrls.root + "/:assignmentId",
}

export enum CourseClassAssignmentErrorMessage {
  ASSIGNMENT_DOES_NOT_EXIST = "assignment doesn't exist!",
}

export type CourseClassAssignmentModel = {
  id: number;
  title: string;
  submission: string;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  classId: number;
};

export type ValuableCourseClassAssignmentModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<CourseClassAssignmentModel>;

/**
 *
 *
 * Dto
 *
 *
 */

export type CreateCourseClassAssignmentDto = {
  title: string;
  submission: string;
  deadline: Date;
};

export type UpdateCourseClassAssignmentDto =
  Partial<CreateCourseClassAssignmentDto>;

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseClassAssignmentResourceId = {
  user: { id: number; role: UserRoleModel };
  courseId: number;
  classId: number;
};
