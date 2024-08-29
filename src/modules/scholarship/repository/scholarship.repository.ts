import BaseRepository from "../../../common/class/BaseRepository";
import { IScholarshipRepository } from "../scholarship.interface";
import { injectable } from "inversify";
import { ScholarshipModel } from "../scholarship.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { $ScholarshipAPI } from "../scholarship.api";

@injectable()
export default class ScholarshipRepository
  extends BaseRepository
  implements IScholarshipRepository
{
  constructor() {
    super();
  }

  public async createScholarship(
    data: $ScholarshipAPI.CreateScholarship.Dto,
  ): Promise<ScholarshipModel> {
    return this.db.scholarship.create({
      data,
    });
  }

  public async getScholarships(): Promise<ScholarshipModel[]> {
    return this.db.scholarship.findMany();
  }

  public async getScholarshipById(
    scholarshipId: number,
  ): Promise<ScholarshipModel | null> {
    return this.db.scholarship.findUnique({
      where: {
        id: scholarshipId,
      },
    });
  }

  public async getScholarshipByIdOrThrow(
    scholarshipId: number,
    error?: Error,
  ): Promise<ScholarshipModel> {
    const scholarship = await this.db.scholarship.findUnique({
      where: {
        id: scholarshipId,
      },
    });

    if (!scholarship) {
      throw error || new RecordNotFoundException();
    }

    return scholarship;
  }

  public async updateScholarship(
    scholarshipId: number,
    data: Partial<ScholarshipModel>,
  ): Promise<ScholarshipModel> {
    return this.db.scholarship.update({
      where: {
        id: scholarshipId,
      },
      data,
    });
  }

  public async deleteScholarship(scholarshipId: number): Promise<{}> {
    return this.db.scholarship.delete({
      where: {
        id: scholarshipId,
      },
      select: {},
    });
  }
}
