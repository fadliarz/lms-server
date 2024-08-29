import { DepartmentModel } from "./department.type";

export namespace $DepartmentAPI {
  const root = "/departments";
  const department = root + ":/departmentId";

  export namespace CreateDepartment {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Dto = {
      title: string;
      description?: string;
      leaderId?: number;
      coLeaderId?: number;
    };
    export type Response = {
      data: DepartmentModel;
    };
  }

  export namespace GetDepartments {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Response = {
      data: DepartmentModel[];
    };
  }

  export namespace GetDepartmentById {
    export const endpoint = department;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}`;
    export type Response = {
      data: DepartmentModel;
    };
  }

  export namespace UpdateDepartment {
    export const endpoint = department;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}`;
    export type Dto = {
      title?: string;
      description?: string;
    };
    export type Response = {
      data: DepartmentModel;
    };
  }

  export namespace UpdateDepartmentLeaderId {
    export const endpoint = department + "/leader";
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}/leader`;
    export type Dto = {
      leaderId: number;
    };
    export type Response = {
      data: DepartmentModel;
    };
  }

  export namespace UpdateDepartmentCoLeaderId {
    export const endpoint = department + "/co-leader";
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}/co-leader`;
    export type Dto = {
      coLeaderId: number;
    };
    export type Response = {
      data: DepartmentModel;
    };
  }

  export namespace DeleteDepartment {
    export const endpoint = department;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}`;
    export type Response = {
      data: {};
    };
  }
}
