import { inject, injectable } from "inversify";
import {
  $DepartmentProgramAPI,
  DepartmentProgramDITypes,
  DepartmentProgramModel,
  DepartmentProgramResourceId,
} from "../program.type";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UserModel } from "../../user/user.type";
import {
  IDepartmentProgramAuthorization,
  IDepartmentProgramRepository,
  IDepartmentProgramService,
} from "../program.interface";

@injectable()
export default class DepartmentProgramService
  extends BaseAuthorization
  implements IDepartmentProgramService
{
  @inject(DepartmentProgramDITypes.REPOSITORY)
  private readonly repository: IDepartmentProgramRepository;

  @inject(DepartmentProgramDITypes.AUTHORIZATION)
  private readonly authorization: IDepartmentProgramAuthorization;

  public async createProgram(
    user: UserModel,
    id: { resourceId: DepartmentProgramResourceId },
    dto: $DepartmentProgramAPI.CreateProgram.Dto,
  ): Promise<$DepartmentProgramAPI.CreateProgram.Response["data"]> {
    try {
      await this.authorization.authorizeCreateProgram(
        user,
        id.resourceId.departmentId,
      );

      return await this.repository.createProgram(
        { departmentId: id.resourceId.departmentId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async getAllPrograms(): Promise<
    $DepartmentProgramAPI.GetAllPrograms.Response["data"]
  > {
    try {
      return await this.getAllPrograms();
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getPrograms(id: {
    resourceId: DepartmentProgramResourceId;
  }): Promise<DepartmentProgramModel[]> {
    try {
      return await this.getPrograms(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getProgramById(id: {
    programId: number;
    resourceId: DepartmentProgramResourceId;
  }): Promise<DepartmentProgramModel> {
    try {
      return await this.getProgramById(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateProgram(
    user: UserModel,
    id: {
      programId: number;
      resourceId: DepartmentProgramResourceId;
    },
    dto: $DepartmentProgramAPI.UpdateProgram.Dto,
  ): Promise<DepartmentProgramModel> {
    try {
      await this.authorization.authorizeUpdateProgram(
        user,
        id.resourceId.departmentId,
      );

      return await this.repository.updateProgram(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async deleteProgram(
    user: UserModel,
    id: {
      programId: number;
      resourceId: DepartmentProgramResourceId;
    },
  ): Promise<{}> {
    try {
      await this.authorization.authorizeDeleteProgram(
        user,
        id.resourceId.departmentId,
      );

      return await this.repository.deleteProgram(id);
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }
}
