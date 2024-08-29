import { DepartmentProgramModel } from "./program.type";

export namespace $DepartmentProgramAPI {
  const root = "/departments/:departmentId/programs";
  const program = root + "/:programId";

  export namespace CreateProgram {
    export const endpoint = root;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}/programs`;
    export type Dto = {
      title: string;
      description?: string;
      date: Date;
    };
    export type Response = {
      data: DepartmentProgramModel;
    };
  }

  export namespace GetAllPrograms {
    export const endpoint = "/programs";
    export const generateUrl = () => {
      return endpoint;
    };
    export type Response = {
      data: Array<
        DepartmentProgramModel & {
          department: {
            id: number;
            title: string;
          };
        }
      >;
    };
  }

  export namespace GetPrograms {
    export const endpoint = root;
    export const generateUrl = (departmentId: number) =>
      `/departments/${departmentId}/programs`;
    export type Response = {
      data: DepartmentProgramModel[];
    };
  }

  export namespace GetProgramById {
    export const endpoint = program;
    export const generateUrl = (departmentId: number, programId: number) =>
      `/departments/${departmentId}/programs/${programId}`;
    export type Response = {
      data: DepartmentProgramModel;
    };
  }

  export namespace UpdateProgram {
    export const endpoint = program;
    export const generateUrl = (departmentId: number, programId: number) =>
      `/departments/${departmentId}/programs/${programId}`;
    export type Dto = {
      title?: string;
      description?: string;
      date?: Date;
    };
    export type Response = {
      data: DepartmentProgramModel;
    };
  }

  export namespace DeleteProgram {
    export const endpoint = program;
    export const generateUrl = (departmentId: number, programId: number) =>
      `/departments/${departmentId}/programs/${programId}`;
    export type Response = {
      data: {};
    };
  }
}
