import { PersonalAssignmentModel } from "./assignment.type";

export namespace $PersonalAssignmentAPI {
  export const root = "/users/:userId/personal-assignments";
  export const assignment = root + "/:assignmentId";

  export namespace CreateAssignment {
    export const endpoint = root;
    export const generateUrl = (userId: number) =>
      `/users/${userId}/personal-assignments`;
    export type Dto = {
      title: string;
      submission: string;
      deadline: Date;
    };
    export type Response = {
      data: PersonalAssignmentModel;
    };
  }

  export namespace UpdateAssignment {
    export const endpoint = assignment;
    export const generateUrl = (userId: number, assignmentId: number) =>
      `/users/${userId}/personal-assignments/${assignmentId}`;
    export type Dto = {
      title?: string;
      submission?: string;
      deadline?: Date;
      isDone?: boolean;
    };
    export type Response = {
      data: PersonalAssignmentModel;
    };
  }

  export namespace DeleteAssignment {
    export const endpoint = assignment;
    export const generateUrl = (userId: number, assignmentId: number) =>
      `/users/${userId}/personal-assignments/${assignmentId}`;
    export type Response = {
      data: {};
    };
  }
}
