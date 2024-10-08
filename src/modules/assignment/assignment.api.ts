import { CourseClassAssignmentModel } from "./assignment.type";
import {
  AssignmentTaskTypeModel,
  PagingQuery,
} from "../../common/shared.types";

export namespace $CourseClassAssignmentAPI {
  const root = "/courses/:courseId/classes/:classId/assignments";
  const assignment = root + "/:assignmentId";

  export namespace CreateAssignment {
    export const endpoint = root;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}/assignments`;
    export type Dto = {
      title: string;
      submission: string;
      deadline: Date;
      description?: string;
      taskType: AssignmentTaskTypeModel;
    };
    export type Response = {
      data: CourseClassAssignmentModel;
    };
  }

  export namespace GetAssignments {
    export const endpoint = root;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}/assignments`;
    export type Query = PagingQuery;
    export type Response = {
      data: CourseClassAssignmentModel[];
    };
  }

  export namespace GetAssignmentById {
    export const endpoint = assignment;
    export const generateUrl = (
      courseId: number,
      classId: number,
      assignmentId: number,
    ) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`;
    export type Response = {
      data: CourseClassAssignmentModel;
    };
  }

  export namespace UpdateAssignment {
    export const endpoint = assignment;
    export const generateUrl = (
      courseId: number,
      classId: number,
      assignmentId: number,
    ) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`;
    export type Dto = {
      title?: string;
      submission?: string;
      deadline?: Date;
      description?: string;
      taskType?: AssignmentTaskTypeModel;
    };
    export type Response = {
      data: CourseClassAssignmentModel;
    };
  }

  export namespace DeleteAssignment {
    export const endpoint = assignment;
    export const generateUrl = (
      courseId: number,
      classId: number,
      assignmentId: number,
    ) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
