import BaseRepository from "../../../common/class/BaseRepository";
import { IDepartmentDivisionEnrollmentRepository } from "../enrollment.interface";
import { injectable } from "inversify";
import {
  DepartmentDivisionEnrollmentModel,
  DepartmentDivisionEnrollmentResourceId,
} from "../enrollment.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { $DepartmentDivisionEnrollmentAPI } from "../enrollment.api";

@injectable()
export default class DepartmentDivisionEnrollmentRepository
  extends BaseRepository
  implements IDepartmentDivisionEnrollmentRepository
{
  constructor() {
    super();
  }

  public async createEnrollment(
    id: {
      divisionId: number;
      resourceId?: Omit<DepartmentDivisionEnrollmentResourceId, "divisionId">;
    },
    dto: $DepartmentDivisionEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<DepartmentDivisionEnrollmentModel> {
    if (id.resourceId) {
      const division = await this.db.departmentDivision.findFirst({
        where: {
          id: id.divisionId,
          department: { id: id.resourceId.departmentId },
        },
      });

      if (!division) {
        throw new RecordNotFoundException();
      }
    }

    return this.db.departmentDivisionEnrollment.create({
      data: { ...dto, divisionId: id.divisionId },
    });
  }

  public async getEnrollments(id: {
    divisionId: number;
    resourceId?: Omit<DepartmentDivisionEnrollmentResourceId, "divisionId">;
  }): Promise<DepartmentDivisionEnrollmentModel[]> {
    return this.db.departmentDivisionEnrollment.findMany({
      where: id.resourceId
        ? {
            division: {
              id: id.divisionId,
              departmentId: id.resourceId.departmentId,
            },
          }
        : { divisionId: id.divisionId },
    });
  }

  public async getEnrollmentById(id: {
    enrollmentId: number;
    resourceId?: DepartmentDivisionEnrollmentResourceId;
  }): Promise<DepartmentDivisionEnrollmentModel | null> {
    return this.db.departmentDivisionEnrollment.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async getEnrollmentByIdOrThrow(
    id: {
      enrollmentId: number;
      resourceId?: DepartmentDivisionEnrollmentResourceId;
    },
    error?: Error,
  ): Promise<DepartmentDivisionEnrollmentModel> {
    const enrollment = await this.getEnrollmentById(id);

    if (!enrollment) {
      throw error || new RecordNotFoundException();
    }

    return enrollment;
  }

  public async deleteEnrollment(id: {
    enrollmentId: number;
    resourceId?: DepartmentDivisionEnrollmentResourceId;
  }): Promise<{}> {
    return this.db.departmentDivisionEnrollment.delete({
      where: this.getWhereObject(id),
      select: {},
    });
  }

  private getWhereObject(id: {
    enrollmentId: number;
    resourceId?: DepartmentDivisionEnrollmentResourceId;
  }):
    | { id: number }
    | {
        id: number;
        division: {
          id: number;
          departmentId: number;
        };
      } {
    if (id.resourceId) {
      return {
        id: id.enrollmentId,
        division: {
          id: id.resourceId.divisionId,
          departmentId: id.resourceId.departmentId,
        },
      };
    }

    return { id: id.enrollmentId };
  }
}
