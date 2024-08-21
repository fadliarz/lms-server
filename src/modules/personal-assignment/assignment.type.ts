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

export const PersonalAssignmentDITypes = {
  REPOSITORY: Symbol.for("PERSONAL_ASSIGNMENT_REPOSITORY"),
  SERVICE: Symbol.for("PERSONAL_ASSIGNMENT_SERVICE"),
  CONTROLLER: Symbol.for("PERSONAL_ASSIGNMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("PERSONAL_ASSIGNMENT_AUTHORIZATION"),
} as const;

export type PersonalAssignmentModel = {
  id: number;
  title: string;
  submission: string;
  deadline: Date;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
};

export type PersonalAssignmentResourceId = {
  userId: number;
};
