import { CourseClassAssignmentCompletionModel } from "./completion.type";

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
