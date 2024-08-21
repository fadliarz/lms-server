import {
  IReportAuthorization,
  IReportRepository,
  IReportService,
} from "../report.interface";
import {
  $ReportAPI,
  ReportDITypes,
  ReportModel,
  ReportResourceId,
} from "../report.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { inject, injectable } from "inversify";

@injectable()
export default class ReportService implements IReportService {
  @inject(ReportDITypes.REPOSITORY)
  private readonly repository: IReportRepository;

  @inject(ReportDITypes.AUTHORIZATION)
  private readonly authorization: IReportAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async getReports(
    resourceId: Omit<ReportResourceId, "targetUserId">,
  ): Promise<$ReportAPI.GetReports.Response["data"]> {
    const { user } = resourceId;

    await this.authorization.authorizeGetReports(user);

    return await this.repository.getReports();
  }

  public async getReportById(
    reportId: number,
    resourceId: ReportResourceId,
  ): Promise<$ReportAPI.GetReportById.Response["data"]> {
    const { user, targetUserId } = resourceId;

    await this.authorization.authorizeGetReportById(user, targetUserId);

    const { report } = await this.validateRelationBetweenResources({
      resourceId,
      reportId,
    });

    return report;
  }

  public async updateReport(
    reportId: number,
    resourceId: ReportResourceId,
    dto: $ReportAPI.UpdateReport.Dto,
  ): Promise<$ReportAPI.UpdateReport.Response["data"]> {
    const { user, targetUserId } = resourceId;

    await this.authorization.authorizeUpdateReport(user, targetUserId);

    return this.repository.updateReport(reportId, dto);
  }

  private async validateRelationBetweenResources(id: {
    resourceId: ReportResourceId;
  }): Promise<void>;
  private async validateRelationBetweenResources(id: {
    reportId: number;
    resourceId: ReportResourceId;
  }): Promise<{
    report: ReportModel;
  }>;
  private async validateRelationBetweenResources<
    T1 extends {
      resourceId: ReportResourceId;
    },
    T2 extends {
      reportId: number;
      resourceId: ReportResourceId;
    },
  >(
    id: T1 | T2,
  ): Promise<void | {
    report: ReportModel;
  }> {
    const { resourceId } = id;
    const { targetUserId } = resourceId;

    if ((id as T2).reportId) {
      const report = await this.prisma.report.findFirst({
        where: {
          id: (id as T2).reportId,
          user: {
            id: targetUserId,
          },
        },
      });

      if (!report) {
        throw new RecordNotFoundException();
      }

      return {
        report,
      };
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new RecordNotFoundException();
    }
  }
}
