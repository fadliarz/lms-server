import { UserRoleModel } from "../course/course.type";

export const DepartmentDivisionDITypes = {
  REPOSITORY: Symbol.for("DEPARTMENT_DIVISION_REPOSITORY"),
  SERVICE: Symbol.for("DEPARTMENT_DIVISION_SERVICE"),
  CONTROLLER: Symbol.for("DEPARTMENT_DIVISION_CONTROLLER"),
  AUTHORIZATION: Symbol.for("DEPARTMENT_DIVISION_AUTHORIZATION"),
} as const;

export type DepartmentDivisionModel = {
  id: number;
  title: string;
  description: string | null;
  totalMembers: number;
  createdAt: Date;
  updatedAt: Date;
  departmentId: number;
  leaderId: number | null;
  coLeaderId: number | null;
};

export type DepartmentDivisionResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
  departmentId: number;
};
