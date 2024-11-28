import { ScholarshipModel } from "./scholarship.type";
import { ScholarshipFundingModel } from "../../common/shared.types";

export namespace $ScholarshipAPI {
  const root = "/scholarships";
  const scholarship = root + "/:scholarshipId";

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
      funding: ScholarshipFundingModel;
      scope: string;
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
      funding?: ScholarshipFundingModel;
      scope?: string;
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
      data: { id: number };
    };
  }
}
