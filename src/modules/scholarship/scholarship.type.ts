export namespace $ScholarshipAPI {
  const root = "/scholarships";
  const scholarship = "root" + "/:scholarshipId";

  export namespace CreateScholarship {
    export const endpoint = root;
    export const generateUrl = () => {
      return endpoint;
    };
    export type Dto = {
      title: string;
      description?: string;
      provider: string;
      deadline: Date;
      reference: string;
    };
    export type Response = {
      data: ScholarshipModel;
    };
  }

  export namespace GetScholarships {
    export const endpoint = root;
    export const generateUrl = () => {
      return endpoint;
    };
    export type Response = {
      data: ScholarshipModel[];
    };
  }

  export namespace GetScholarshipById {
    export const endpoint = scholarship;
    export const generateUrl = (scholarshipId: number) =>
      `/scholarships/${scholarshipId}`;
    export type Response = {
      data: ScholarshipModel;
    };
  }

  export namespace UpdateScholarship {
    export const endpoint = scholarship;
    export const generateUrl = (scholarshipId: number) =>
      `/scholarships/${scholarshipId}`;
    export type Dto = {
      title?: string;
      description?: string;
      provider?: string;
      deadline?: Date;
      reference?: string;
    };
    export type Response = {
      data: ScholarshipModel;
    };
  }

  export namespace DeleteScholarship {
    export const endpoint = scholarship;
    export const generateUrl = (scholarshipId: number) =>
      `/scholarships/${scholarshipId}`;
    export type Response = {
      data: {};
    };
  }
}

export const ScholarshipDITypes = {
  REPOSITORY: Symbol.for("SCHOLARSHIP_REPOSITORY"),
  SERVICE: Symbol.for("SCHOLARSHIP_SERVICE"),
  CONTROLLER: Symbol.for("SCHOLARSHIP_CONTROLLER"),
  AUTHORIZATION: Symbol.for("SCHOLARSHIP_AUTHORIZATION"),
} as const;

export type ScholarshipModel = {
  id: number;
  title: string;
  description: string | null;
  provider: string;
  deadline: Date;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};
