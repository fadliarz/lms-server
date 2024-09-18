import { inject, injectable } from "inversify";
import {
  IDepartmentDivisionAuthorization,
  IDepartmentDivisionRepository,
  IDepartmentDivisionService,
} from "../division.interface";
import {
  DepartmentDivisionDITypes,
  DepartmentDivisionModel,
  DepartmentDivisionResourceId,
} from "../division.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import asyncLocalStorage from "../../../common/asyncLocalStorage";
import { LocalStorageKey } from "../../../common/constants/LocalStorageKey";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { UnauthenticatedResourceId } from "../../../common/types";
import ClientException from "../../../common/class/exceptions/ClientException";
import { $DepartmentDivisionAPI } from "../division.api";

@injectable()
export default class DepartmentDivisionService
  extends BaseAuthorization
  implements IDepartmentDivisionService
{
  @inject(DepartmentDivisionDITypes.REPOSITORY)
  private readonly repository: IDepartmentDivisionRepository;

  @inject(DepartmentDivisionDITypes.AUTHORIZATION)
  private readonly authorization: IDepartmentDivisionAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createDivision(
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.CreateDivision.Dto,
  ): Promise<$DepartmentDivisionAPI.CreateDivision.Response["data"]> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
          ...resources
        } = resourceId;
        const { departmentId } = resources;
        const { leaderId, coLeaderId } = dto;

        const user = await this.globalRepository.user.getUserByIdOrThrow({
          userId,
        });
        const department =
          await this.globalRepository.department.getDepartmentByIdOrThrow(
            departmentId,
          );
        this.authorization.authorizeCreateDivision(user, department);

        if (leaderId && coLeaderId && leaderId == coLeaderId) {
          throw new ClientException(
            "leaderId and coLeaderId should be distinct!",
          );
        }

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.createDivision({ ...resources, ...dto });
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async getDivisions(
    resourceId: DepartmentDivisionResourceId,
  ): Promise<$DepartmentDivisionAPI.GetDivisions.Response["data"]> {
    return await this.repository.getDivisions(resourceId.departmentId);
  }

  public async getDivisionById(
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
  ): Promise<$DepartmentDivisionAPI.GetDivisionById.Response["data"]> {
    return await this.validateRelationBetweenResources(divisionId, resourceId);
  }

  public async updateDivision(
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.UpdateDivision.Dto,
  ): Promise<$DepartmentDivisionAPI.UpdateDivision.Response["data"]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
          ...resources
        } = resourceId;
        const { departmentId } = resources;

        const user = await this.globalRepository.user.getUserByIdOrThrow({
          userId,
        });
        const department =
          await this.globalRepository.department.getDepartmentByIdOrThrow(
            departmentId,
          );
        const division = await this.getDivisionById(divisionId, resourceId);
        this.authorization.authorizeUpdateDivision(user, department, division);

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.updateDivision(divisionId, dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async updateDivisionLeaderId(
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.UpdateDivisionLeaderId.Dto,
  ): Promise<$DepartmentDivisionAPI.UpdateDivisionLeaderId.Response["data"]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
          ...resources
        } = resourceId;
        const { departmentId } = resources;
        const { leaderId } = dto;

        const user = await this.globalRepository.user.getUserByIdOrThrow({
          userId,
        });
        const department =
          await this.globalRepository.department.getDepartmentByIdOrThrow(
            departmentId,
          );
        this.authorization.authorizeUpdateDivisionLeaderId(user, department);

        if (department.coLeaderId == leaderId) {
          throw new ClientException(
            "leaderId and coLeaderId should be distinct!",
          );
        }

        await this.globalRepository.user.getUserByIdOrThrow(
          { userId },
          new RecordNotFoundException(
            `user with id ${leaderId} doesn't exist!`,
          ),
        );

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.updateDivision(divisionId, dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async updateDivisionCoLeaderId(
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
    dto: $DepartmentDivisionAPI.UpdateDivisionCoLeaderId.Dto,
  ): Promise<$DepartmentDivisionAPI.UpdateDivisionCoLeaderId.Response["data"]> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
          ...resources
        } = resourceId;
        const { departmentId } = resources;
        const { coLeaderId } = dto;

        const user = await this.globalRepository.user.getUserByIdOrThrow({
          userId,
        });
        const department =
          await this.globalRepository.department.getDepartmentByIdOrThrow(
            departmentId,
          );
        this.authorization.authorizeUpdateDivisionCoLeaderId(user, department);

        if (department.leaderId == coLeaderId) {
          throw new ClientException(
            "leaderId and coLeaderId should be distinct!",
          );
        }

        await this.globalRepository.user.getUserByIdOrThrow(
          { userId: coLeaderId },
          new RecordNotFoundException(
            `user with id ${coLeaderId} doesn't exist!`,
          ),
        );

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.updateDivision(divisionId, dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async deleteDivision(
    divisionId: number,
    resourceId: DepartmentDivisionResourceId,
  ): Promise<$DepartmentDivisionAPI.DeleteDivision.Response["data"]> {
    await this.validateRelationBetweenResources(divisionId, resourceId);

    return await this.repository.deleteDivision(divisionId);
  }

  private async validateRelationBetweenResources(
    divisionId: number,
    resourceId: UnauthenticatedResourceId<DepartmentDivisionResourceId>,
  ): Promise<DepartmentDivisionModel> {
    const { departmentId } = resourceId;
    const division = await this.repository.getDivisionById(divisionId);

    if (!division || division.departmentId !== departmentId) {
      throw new RecordNotFoundException("");
    }

    return division;
  }
}
