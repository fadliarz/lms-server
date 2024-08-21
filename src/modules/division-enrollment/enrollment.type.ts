export namespace $DepartmentDivisionEnrollmentAPI {
  const root = "/departments/:departmentId/divisions/:divisionId/enrollments";
  const enrollment = root + "/:enrollmentId";

  export namespace CreateEnrollment {
    export const endpoint = root;
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}/enrollments`;
    export type Dto = {
      userId: number;
    };
    export type Response = {
      data: DepartmentDivisionEnrollmentModel;
    };
  }

  export namespace GetEnrollments {
    export const endpoint = root;
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}/enrollments`;
    export type Response = {
      data: DepartmentDivisionEnrollmentModel[];
    };
  }

  export namespace DeleteEnrollment {
    export const endpoint = enrollment;
    export const generateUrl = (
      departmentId: number,
      divisionId: number,
      enrollmentId: number,
    ) =>
      `/departments/${departmentId}/divisions/${divisionId}/enrollments/${enrollmentId}`;
    export type Response = {
      data: {};
    };
  }
}

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
