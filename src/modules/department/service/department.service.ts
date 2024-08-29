import {
  IDepartmentAuthorization,
  IDepartmentRepository,
  IDepartmentService,
} from "../department.interface";
import { inject, injectable } from "inversify";
import {
  DepartmentDITypes,
  DepartmentModel,
  DepartmentResourceId,
} from "../department.type";
import asyncLocalStorage from "../../../common/asyncLocalStorage";
import { LocalStorageKey } from "../../../common/constants/LocalStorageKey";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { $DepartmentAPI } from "../department.api";
import ClientException from "../../../common/class/exceptions/ClientException";

@injectable()
export default class DepartmentService
  extends BaseAuthorization
  implements IDepartmentService
{
  @inject(DepartmentDITypes.REPOSITORY)
  private readonly repository: IDepartmentRepository;

  @inject(DepartmentDITypes.AUTHORIZATION)
  private readonly authorization: IDepartmentAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createDepartment(
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.CreateDepartment.Dto,
  ): Promise<DepartmentModel> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
        } = resourceId;
        const { leaderId, coLeaderId } = dto;

        await this.authorizeUserRole(
          tx,
          resourceId,
          this.authorization.authorizeCreateDepartment.bind(this.authorization),
        );

        if (leaderId && coLeaderId && leaderId == coLeaderId) {
          new ClientException("leaderId and coLeaderId should be distinct!");
        }

        if (leaderId) {
          await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
            tx,
            userId,
            new RecordNotFoundException(
              `user with id ${leaderId} doesn't exist!`,
            ),
          );
        }

        if (coLeaderId) {
          await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
            tx,
            coLeaderId,
            new RecordNotFoundException(
              `user with id ${coLeaderId} doesn't exist!`,
            ),
          );
        }

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.createDepartment(dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async getDepartments(): Promise<DepartmentModel[]> {
    return this.repository.getDepartments();
  }

  public async getDepartmentById(
    departmentId: number,
  ): Promise<DepartmentModel> {
    return this.repository.getDepartmentByIdOrThrow(departmentId);
  }

  public async updateDepartment(
    departmentId: number,
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.UpdateDepartment.Dto,
  ): Promise<DepartmentModel> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
        } = resourceId;

        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new RecordNotFoundException(),
        );
        const department =
          await this.prismaQueryRaw.department.selectForUpdateByIdOrThrow(
            tx,
            departmentId,
            new RecordNotFoundException(),
          );
        this.authorization.authorizeUpdateDepartment(user, department);

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.updateDepartment(departmentId, dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async updateDepartmentLeaderId(
    departmentId: number,
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.UpdateDepartmentLeaderId.Dto,
  ): Promise<DepartmentModel> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
        } = resourceId;
        const { leaderId } = dto;

        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new RecordNotFoundException(),
        );
        const department =
          await this.prismaQueryRaw.department.selectForUpdateByIdOrThrow(
            tx,
            departmentId,
            new RecordNotFoundException(),
          );
        this.authorization.authorizeUpdateDepartment(user, department);

        if (department.coLeaderId == leaderId) {
          throw new ClientException(
            "leaderId and coLeaderId should be distinct!",
          );
        }

        await this.globalRepository.user.getUserByIdOrThrow(
          { userId: leaderId },
          new RecordNotFoundException(
            `user with id ${leaderId} doesn't exist!`,
          ),
        );

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.updateDepartment(departmentId, dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async updateDepartmentCoLeaderId(
    departmentId: number,
    resourceId: DepartmentResourceId,
    dto: $DepartmentAPI.UpdateDepartmentCoLeaderId.Dto,
  ): Promise<DepartmentModel> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
        } = resourceId;
        const { coLeaderId } = dto;

        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new RecordNotFoundException(),
        );
        const department =
          await this.prismaQueryRaw.department.selectForUpdateByIdOrThrow(
            tx,
            departmentId,
            new RecordNotFoundException(),
          );
        this.authorization.authorizeUpdateDepartment(user, department);

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
            return this.repository.updateDepartment(departmentId, dto);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }

  public async deleteDepartment(
    departmentId: number,
    resourceId: DepartmentResourceId,
  ): Promise<{}> {
    try {
      return this.prisma.$transaction(async (tx) => {
        const {
          user: { id: userId },
        } = resourceId;

        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new RecordNotFoundException(),
        );
        this.authorization.authorizeDeleteDepartment(user);

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return this.repository.deleteDepartment(departmentId);
          },
        );
      });
    } catch (error: any) {
      throw handleRepositoryError(error, {});
    }
  }
}
