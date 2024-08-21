import { injectable } from "inversify";
import BaseRepository from "../../../common/class/BaseRepository";
import {
  $DepartmentProgramAPI,
  DepartmentProgramModel,
  DepartmentProgramResourceId,
} from "../program.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { IDepartmentProgramRepository } from "../program.interface";

@injectable()
export default class DepartmentProgramRepository
  extends BaseRepository
  implements IDepartmentProgramRepository
{
  constructor() {
    super();
  }

  public async createProgram(
    id: {
      departmentId: number;
    },
    data: $DepartmentProgramAPI.CreateProgram.Dto,
  ): Promise<DepartmentProgramModel> {
    return this.db.departmentProgram.create({
      data: { ...data, ...id },
    });
  }

  public async getAllPrograms(): Promise<
    $DepartmentProgramAPI.GetAllPrograms.Response["data"]
  > {
    return this.db.departmentProgram.findMany({
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

  public async getPrograms(id: {
    departmentId: number;
  }): Promise<DepartmentProgramModel[]> {
    return this.db.departmentProgram.findMany({
      where: id,
    });
  }

  public async getProgramById(id: {
    programId: number;
    resourceId?: DepartmentProgramResourceId;
  }): Promise<DepartmentProgramModel | null> {
    return this.db.departmentProgram.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async getProgramByIdOrThrow(
    id: {
      programId: number;
      resourceId?: DepartmentProgramResourceId;
    },
    error?: Error,
  ): Promise<DepartmentProgramModel> {
    const program = await this.getProgramById(id);

    if (!program) {
      throw error || new RecordNotFoundException();
    }

    return program;
  }

  public async updateProgram(
    id: { programId: number; resourceId?: DepartmentProgramResourceId },
    data: Partial<DepartmentProgramModel>,
  ): Promise<DepartmentProgramModel> {
    return this.db.departmentProgram.update({
      where: this.getWhereObject(id),
      data,
    });
  }

  public async deleteProgram(id: {
    programId: number;
    resourceId?: DepartmentProgramResourceId;
  }): Promise<{}> {
    return this.db.departmentProgram.delete({
      where: this.getWhereObject(id),
      select: {},
    });
  }

  private getWhereObject(id: {
    programId: number;
    resourceId?: DepartmentProgramResourceId;
  }):
    | { id: number }
    | {
        id: number;
        department: { id: number };
      } {
    if (id.resourceId) {
      return {
        id: id.programId,
        department: { id: id.resourceId.departmentId },
      };
    }

    return { id: id.programId };
  }
}
