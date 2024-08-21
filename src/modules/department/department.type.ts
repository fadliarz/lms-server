import { UserRoleModel } from "../course/course.type";

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

export const DepartmentDITypes = {
  REPOSITORY: Symbol.for("DEPARTMENT_REPOSITORY"),
  SERVICE: Symbol.for("DEPARTMENT_SERVICE"),
  CONTROLLER: Symbol.for("DEPARTMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("DEPARTMENT_AUTHORIZATION"),
} as const;

export type DepartmentModel = {
  id: number;
  title: string;
  description: string | null;
  totalDivisions: number;
  totalMembers: number;
  totalPrograms: number;
  totalProgramEnrollments: number;
  createdAt: Date;
  updatedAt: Date;
  leaderId: number | null;
  coLeaderId: number | null;
};

export type DepartmentResourceId = {
  user: {
    id: number;
    role: UserRoleModel;
  };
};
