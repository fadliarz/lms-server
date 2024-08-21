import { UserModel } from "../user/user.type";

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

export const ReportDITypes = {
  REPOSITORY: Symbol.for("REPORT_REPOSITORY"),
  SERVICE: Symbol.for("REPORT_SERVICE"),
  CONTROLLER: Symbol.for("REPORT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("REPORT_AUTHORIZATION"),
} as const;

export type ReportModel = {
  id: number;
  points: number | null;
  performance: number | null;
  participation: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
};

export type ReportResourceId = {
  user: UserModel;
  targetUserId: number;
};
