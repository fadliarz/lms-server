import { UserModel } from "../user/user.type";
import { ReportModel } from "./report.type";

export namespace $ReportAPI {
  const root = "/users/:userId/reports";
  const report = root + "/:reportId";

  export namespace GetReports {
    export const endpoint = "/reports";
    export const generateUrl = () => endpoint;
    export type Response = {
      data: (ReportModel & { user: Pick<UserModel, "name" | "NIM"> })[];
    };
  }

  export namespace GetReportById {
    export const endpoint = report;
    export const generateUrl = (userId: number, reportId: number) =>
      `/users/${userId}/reports/${reportId}`;
    export type Response = {
      data: ReportModel;
    };
  }

  export namespace UpdateReport {
    export const endpoint = report;
    export const generateUrl = (userId: number, reportId: number) =>
      `/users/${userId}/reports/${reportId}`;
    export type Dto = {
      points?: number;
      performance?: number;
      participation?: number;
    };
    export type Response = {
      data: ReportModel;
    };
  }
}
