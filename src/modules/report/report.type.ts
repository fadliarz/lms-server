import { UserModel } from "../user/user.type";

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
