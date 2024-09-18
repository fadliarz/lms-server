import { AssignmentTaskTypeModel } from "../../common/shared.types";

export const CourseClassAssignmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_ASSIGNMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_ASSIGNMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_ASSIGNMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_ASSIGNMENT_AUTHORIZATION"),
} as const;

export type CourseClassAssignmentModel = {
  id: number;
  title: string;
  submission: string;
  deadline: Date;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  taskType: AssignmentTaskTypeModel;
  classId: number;
};

export type CourseClassAssignmentResourceId = {
  courseId: number;
  classId: number;
};
