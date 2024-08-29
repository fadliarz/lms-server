import { UserRoleModel } from "../course/course.type";

export const DepartmentDITypes = {
  REPOSITORY: Symbol.for("DEPARTMENT_REPOSITORY"),
  SERVICE: Symbol.for("DEPARTMENT_SERVICE"),
  CONTROLLER: Symbol.for("DEPARTMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("DEPARTMENT_AUTHORIZATION"),
} as const;

export type DepartmentModel = {
  id: number;
  title: string;
  description: string | null;
  totalDivisions: number;
  totalMembers: number;
  totalPrograms: number;
  totalProgramEnrollments: number;
  createdAt: Date;
  updatedAt: Date;
  leaderId: number | null;
  coLeaderId: number | null;
};

export type DepartmentResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
};
