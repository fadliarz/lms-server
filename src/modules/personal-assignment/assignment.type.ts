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
