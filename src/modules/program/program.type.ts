export const DepartmentProgramDITypes = {
  REPOSITORY: Symbol.for("DEPARTMENT_PROGRAM_REPOSITORY"),
  SERVICE: Symbol.for("DEPARTMENT_PROGRAM_SERVICE"),
  CONTROLLER: Symbol.for("DEPARTMENT_PROGRAM_CONTROLLER"),
  AUTHORIZATION: Symbol.for("DEPARTMENT_PROGRAM_AUTHORIZATION"),
} as const;

export type DepartmentProgramModel = {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  departmentId: number;
};

export type DepartmentProgramResourceId = {
  departmentId: number;
};
