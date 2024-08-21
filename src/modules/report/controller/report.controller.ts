import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import NaNException from "../../../common/class/exceptions/NaNException";
import { IReportController, IReportService } from "../report.interface";
import { $ReportAPI, ReportDITypes, ReportResourceId } from "../report.type";
import { UpdateReportDtoJoi } from "./report.joi";

@injectable()
export default class ReportController implements IReportController {
  @inject(ReportDITypes.SERVICE)
  private readonly service: IReportService;

  public async getReports(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const user = getRequestUserOrThrowAuthenticationException(req);
      const reports = await this.service.getReports({ user });

      return res.status(StatusCode.SUCCESS).json({
        data: reports,
      } satisfies $ReportAPI.GetReports.Response);
    } catch (error) {
      next(error);
    }
  }

  public async getReportById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const reportId = this.validateReportId(req);
      const resourceId = this.validateResourceId(req);

      const report = await this.service.getReportById(reportId, resourceId);

      return res.status(StatusCode.SUCCESS).json({
        data: report,
      } satisfies $ReportAPI.GetReportById.Response);
    } catch (error) {
      next(error);
    }
  }

  public async updateReport(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({
        body: UpdateReportDtoJoi,
      })(req, res, next);
      const reportId = this.validateReportId(req);
      const resourceId = this.validateResourceId(req);

      const updatedReport = await this.service.updateReport(
        reportId,
        resourceId,
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedReport,
      } satisfies $ReportAPI.UpdateReport.Response);
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): ReportResourceId {
    const user = getRequestUserOrThrowAuthenticationException(req);
    const targetUserId: number = Number(req.params.userId);
    if (isNaN(targetUserId)) {
      throw new NaNException("userId");
    }
    return {
      user,
      targetUserId,
    };
  }

  private validateReportId(req: Request): number {
    const reportId: number = Number(req.params.validateReportId);
    if (isNaN(reportId)) {
      throw new NaNException("reportId");
    }

    return reportId;
  }
}
