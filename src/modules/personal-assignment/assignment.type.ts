import {
  AssignmentCompletionStatusModel,
  AssignmentTaskTypeModel,
} from "../../common/shared.types";

export const PersonalAssignmentDITypes = {
  REPOSITORY: Symbol.for("PERSONAL_ASSIGNMENT_REPOSITORY"),
  SERVICE: Symbol.for("PERSONAL_ASSIGNMENT_SERVICE"),
  CONTROLLER: Symbol.for("PERSONAL_ASSIGNMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("PERSONAL_ASSIGNMENT_AUTHORIZATION"),
} as const;

export type PersonalAssignmentModel = {
  id: number;
  title: string;
  course: string;
  submission: string;
  description: string | null;
  deadline: Date;
  taskType: AssignmentTaskTypeModel;
  completionStatus: AssignmentCompletionStatusModel;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
};

export type PersonalAssignmentResourceId = {
  userId: number;
};
