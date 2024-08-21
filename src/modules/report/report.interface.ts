import { $ReportAPI, ReportModel, ReportResourceId } from "./report.type";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.type";

export interface IReportAuthorization {
  authorizeGetReports: (user: UserModel) => Promise<void>;
  authorizeGetReportById: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
  authorizeUpdateReport: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
}

export interface IReportController {
  getReports: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getReportById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateReport: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IReportService {
  getReports: (
    resourceId: Omit<ReportResourceId, "targetUserId">,
  ) => Promise<$ReportAPI.GetReports.Response["data"]>;
  getReportById: (
    reportId: number,
    resourceId: ReportResourceId,
  ) => Promise<$ReportAPI.GetReportById.Response["data"]>;
  updateReport: (
    reportId: number,
    resourceId: ReportResourceId,
    dto: $ReportAPI.UpdateReport.Dto,
  ) => Promise<$ReportAPI.UpdateReport.Response["data"]>;
}

export interface IReportRepository {
  createReport: (
    id: { userId: number },
    data: {
      points?: number;
      performance?: number;
      participation?: number;
    },
  ) => Promise<ReportModel>;
  getReports: () => Promise<$ReportAPI.GetReports.Response["data"]>;
  getReportById: (reportId: number) => Promise<ReportModel | null>;
  getReportByIdOrThrow: (
    reportId: number,
    error?: Error,
  ) => Promise<ReportModel>;
  updateReport: (
    reportId: number,
    data: Partial<ReportModel>,
  ) => Promise<ReportModel>;
}
