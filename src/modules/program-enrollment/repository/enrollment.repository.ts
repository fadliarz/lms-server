import { IDepartmentProgramEnrollmentRepository } from "../enrollment.interface";
import {
  $DepartmentProgramEnrollmentAPI,
  DepartmentProgramEnrollmentModel,
  DepartmentProgramEnrollmentResourceId,
} from "../enrollment.type";
import BaseRepository from "../../../common/class/BaseRepository";
import { injectable } from "inversify";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class DepartmentProgramEnrollmentRepository
  extends BaseRepository
  implements IDepartmentProgramEnrollmentRepository
{
  constructor() {
    super();
  }

  public async createEnrollment(
    id: {
      programId: number;
      resourceId?: Omit<DepartmentProgramEnrollmentResourceId, "programId">;
    },
    data: $DepartmentProgramEnrollmentAPI.CreateEnrollment.Dto,
  ): Promise<DepartmentProgramEnrollmentModel> {
    if (id.resourceId) {
      const program = await this.db.departmentProgram.findFirst({
        where: {
          id: id.programId,
          departmentId: id.resourceId.departmentId,
        },
        select: {},
      });

      if (program === null) {
        throw new RecordNotFoundException();
      }
    }

    return this.db.departmentProgramEnrollment.create({
      data: { ...data, programId: id.programId },
    });
  }

  public async getEnrollmentById(id: {
    enrollmentId: number;
    resourceId?: DepartmentProgramEnrollmentResourceId;
  }): Promise<DepartmentProgramEnrollmentModel | null> {
    return this.db.departmentProgramEnrollment.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async getEnrollmentByIdOrThrow(
    id: {
      enrollmentId: number;
      resourceId?: DepartmentProgramEnrollmentResourceId;
    },
    error?: Error,
  ): Promise<DepartmentProgramEnrollmentModel> {
    const enrollment = await this.getEnrollmentById(id);

    if (!enrollment) {
      throw error || new RecordNotFoundException();
    }

    return enrollment;
  }

  public async deleteEnrollment(id: {
    enrollmentId: number;
    resourceId?: DepartmentProgramEnrollmentResourceId;
  }): Promise<{}> {
    return this.db.departmentProgramEnrollment.delete({
      where: this.getWhereObject(id),
      select: {},
    });
  }

  private getWhereObject(id: {
    enrollmentId: number;
    resourceId?: DepartmentProgramEnrollmentResourceId;
  }):
    | {
        id: number;
      }
    | { id: number; program: { id: number; department: { id: number } } } {
    if (id.resourceId) {
      return {
        id: id.enrollmentId,
        program: {
          id: id.resourceId.programId,
          department: { id: id.resourceId.departmentId },
        },
      };
    }

    return { id: id.enrollmentId };
  }
}
