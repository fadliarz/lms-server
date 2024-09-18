import { DepartmentProgramEnrollmentModel } from "./enrollment.type";

export namespace $DepartmentProgramEnrollmentAPI {
  export const root =
    "/departments/:departmentId/programs/:programId/enrollments";
  export const enrollment = root + "/:enrollmentId";

  export namespace CreateEnrollment {
    export const endpoint = root;
    export const generateUrl = (departmentId: number, programId: number) =>
      `/departments/${departmentId}/programs/${programId}/enrollments`;
    export type Dto = {
      userId: number;
    };
    export type Response = {
      data: DepartmentProgramEnrollmentModel;
    };
  }

  export namespace DeleteEnrollment {
    export const endpoint = enrollment;
    export const generateUrl = (
      departmentId: number,
      divisionId: number,
      programId: number,
    ) => `/departments/${departmentId}/programs/${programId}/enrollments`;
    export type Response = {
      data: { id: number };
    };
  }
}
