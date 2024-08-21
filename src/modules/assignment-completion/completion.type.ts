export namespace $CourseClassAssignmentCompletionAPI {
  const root =
    "/courses/:courseId/classes/:classId/assignments/:assignmentId/completions";
  const completion = root + "/:completionId";

  export namespace CreateCompletion {
    export const endpoint = root;
    export const generateUrl = (
      courseId: number,
      classId: number,
      assignmentId: number,
    ) =>
      `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}/completions`;
    export type Dto = {
      userId: number;
    };
    export type Response = {
      data: CourseClassAssignmentCompletionModel;
    };
  }

  export namespace DeleteCompletion {
    export const endpoint = completion;
    export const generateUrl = (
      courseId: number,
      classId: number,
      assignmentId: number,
      completionId: number,
    ) =>
      `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}/completions/${completionId}`;
    export type Response = {
      data: {};
    };
  }
}

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
