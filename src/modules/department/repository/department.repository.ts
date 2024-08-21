import { IDepartmentRepository } from "../department.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $DepartmentAPI, DepartmentModel } from "../department.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { injectable } from "inversify";

@injectable()
export default class DepartmentRepository
  extends BaseRepository
  implements IDepartmentRepository
{
  constructor() {
    super();
  }

  public async createDepartment(
    data: $DepartmentAPI.CreateDepartment.Dto,
  ): Promise<DepartmentModel> {
    return this.db.department.create({
      data,
    });
  }

  public async getDepartments(): Promise<DepartmentModel[]> {
    return this.db.department.findMany();
  }

  public async getDepartmentById(
    departmentId: number,
  ): Promise<DepartmentModel | null> {
    return this.db.department.findUnique({
      where: {
        id: departmentId,
      },
    });
  }

  public async getDepartmentByIdOrThrow(
    departmentId: number,
    error?: Error,
  ): Promise<DepartmentModel> {
    const department = await this.getDepartmentById(departmentId);

    if (!department) {
      throw error || new RecordNotFoundException();
    }

    return department;
  }

  public async updateDepartment(
    departmentId: number,
    data: Partial<DepartmentModel>,
  ): Promise<DepartmentModel> {
    return this.db.department.update({
      where: {
        id: departmentId,
      },
      data,
    });
  }

  public async deleteDepartment(departmentId: number): Promise<{}> {
    return this.db.department.delete({
      where: {
        id: departmentId,
      },
      select: {},
    });
  }
}
