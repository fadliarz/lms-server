import { IDepartmentDivisionRepository } from "../division.interface";
import { DepartmentDivisionModel } from "../division.type";
import BaseRepository from "../../../common/class/BaseRepository";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { injectable } from "inversify";
import { $DepartmentDivisionAPI } from "../division.api";

@injectable()
export default class DepartmentDivisionRepository
  extends BaseRepository
  implements IDepartmentDivisionRepository
{
  constructor() {
    super();
  }

  public async createDivision(
    data: {
      departmentId: number;
    } & $DepartmentDivisionAPI.CreateDivision.Dto,
  ): Promise<DepartmentDivisionModel> {
    return this.db.departmentDivision.create({
      data,
    });
  }

  public async getDivisions(
    departmentId: number,
  ): Promise<DepartmentDivisionModel[]> {
    return this.db.departmentDivision.findMany({
      where: {
        departmentId,
      },
    });
  }

  public async getAllExtendedDivisions(): Promise<
    (DepartmentDivisionModel & { department: { id: number; title: string } })[]
  > {
    return this.db.departmentDivision.findMany({
      include: {
        department: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  public async getDivisionById(
    divisionId: number,
  ): Promise<DepartmentDivisionModel | null> {
    return this.db.departmentDivision.findFirst({
      where: {
        id: divisionId,
      },
    });
  }

  public async getDivisionByIdOrThrow(
    divisionId: number,
    error?: Error,
  ): Promise<DepartmentDivisionModel> {
    const division = await this.getDivisionById(divisionId);

    if (!division) {
      throw error || new RecordNotFoundException();
    }

    return division;
  }

  public async updateDivision(
    divisionId: number,
    data: Partial<DepartmentDivisionModel>,
  ): Promise<DepartmentDivisionModel> {
    return this.db.departmentDivision.update({
      where: {
        id: divisionId,
      },
      data,
    });
  }

  public async deleteDivision(divisionId: number): Promise<{}> {
    return this.db.departmentDivision.delete({
      where: {
        id: divisionId,
      },
      select: {},
    });
  }
}
