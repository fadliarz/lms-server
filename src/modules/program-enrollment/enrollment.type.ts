export const DepartmentProgramEnrollmentDITypes = {
  REPOSITORY: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("DEPARTMENT_PROGRAM_ENROLLMENT_AUTHORIZATION"),
} as const;

export type DepartmentProgramEnrollmentModel = {
  id: number;
  userId: number;
  programId: number;
};

export type DepartmentProgramEnrollmentResourceId = {
  departmentId: number;
  programId: number;
};
