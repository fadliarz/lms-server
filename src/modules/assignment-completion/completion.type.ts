export const CourseClassAssignmentCompletionDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_AUTHORIZATION"),
} as const;

export type CourseClassAssignmentCompletionModel = {
  id: number;
  userId: number;
  assignmentId: number;
};

export type CourseClassAssignmentCompletionResourceId = {
  courseId: number;
  classId: number;
  assignmentId: number;
};
