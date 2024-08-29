import { DepartmentDivisionEnrollmentModel } from "./enrollment.type";

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
