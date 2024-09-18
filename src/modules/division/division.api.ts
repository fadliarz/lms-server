import { DepartmentDivisionModel } from "./division.type";

export namespace $DepartmentDivisionAPI {
  const root = "/departments/:departmentId/divisions";
  const division = root + "/:divisionId";

  export namespace CreateDivision {
    export const endpoint = root;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}/divisions`;
    export type Dto = {
      title: string;
      description?: string;
      leaderId?: number;
      coLeaderId?: number;
    };
    export type Response = {
      data: DepartmentDivisionModel;
    };
  }

  export namespace GetDivisions {
    export const endpoint = root;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}/divisions`;
    export type Response = {
      data: DepartmentDivisionModel[];
    };
  }

  export namespace GetDivisionById {
    export const endpoint = division;
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}`;
    export type Response = {
      data: DepartmentDivisionModel;
    };
  }

  export namespace UpdateDivision {
    export const endpoint = division;
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}`;
    export type Dto = {
      title?: string;
      description?: string;
    };
    export type Response = {
      data: DepartmentDivisionModel;
    };
  }

  export namespace UpdateDivisionLeaderId {
    export const endpoint = division + "/leader";
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}/leader`;
    export type Dto = {
      leaderId: number;
    };
    export type Response = {
      data: DepartmentDivisionModel;
    };
  }

  export namespace UpdateDivisionCoLeaderId {
    export const endpoint = division + "/co-leader";
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}/co-leader`;
    export type Dto = {
      coLeaderId: number;
    };
    export type Response = {
      data: DepartmentDivisionModel;
    };
  }

  export namespace DeleteDivision {
    export const endpoint = division;
    export const generateUrl = (departmentId: number, divisionId: number) =>
      `/departments/${departmentId}/divisions/${divisionId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
