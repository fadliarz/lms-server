import { injectable } from "inversify";
import { IReportRepository } from "../report.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $ReportAPI, ReportModel } from "../report.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class ReportRepository
  extends BaseRepository
  implements IReportRepository
{
  constructor() {
    super();
  }

  public async createReport(
    id: { userId: number },
    data: {
      points?: number;
      performance?: number;
      participation?: number;
    },
  ): Promise<ReportModel> {
    return this.db.report.create({
      data: { ...data, ...id },
    });
  }

  public async getReports(): Promise<$ReportAPI.GetReports.Response["data"]> {
    return this.db.report.findMany({
      include: {
        user: {
          select: {
            name: true,
            NIM: true,
          },
        },
      },
    });
  }

  public async getReportById(reportId: number): Promise<ReportModel | null> {
    return this.db.report.findUnique({
      where: {
        id: reportId,
      },
    });
  }

  public async getReportByIdOrThrow(
    reportId: number,
    error?: Error,
  ): Promise<ReportModel> {
    const report = await this.db.report.findUnique({
      where: {
        id: reportId,
      },
    });

    if (!report) {
      throw error || new RecordNotFoundException();
    }

    return report;
  }

  public async updateReport(
    reportId: number,
    data: Partial<ReportModel>,
  ): Promise<ReportModel> {
    return this.db.report.update({
      where: {
        id: reportId,
      },
      data,
    });
  }
}
