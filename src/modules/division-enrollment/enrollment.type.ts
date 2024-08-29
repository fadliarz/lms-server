export const DepartmentDivisionEnrollmentDITypes = {
  REPOSITORY: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("DEPARTMENT_DIVISION_ENROLLMENT_AUTHORIZATION"),
} as const;

export type DepartmentDivisionEnrollmentModel = {
  id: number;
  userId: number;
  divisionId: number;
};

export type DepartmentDivisionEnrollmentResourceId = {
  departmentId: number;
  divisionId: number;
};
