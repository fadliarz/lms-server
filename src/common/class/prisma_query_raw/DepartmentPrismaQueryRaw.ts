import "reflect-metadata";
import { IDepartmentPrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { mapPrismaQueryRawObject } from "./prisma_query_raw.utils";
import { PrismaTransaction } from "../../types";
import { DepartmentModel } from "../../../modules/department/department.type";

@injectable()
export default class DepartmentPrismaQueryRaw
  implements IDepartmentPrismaQueryRaw
{
  public async selectForUpdateById(
    tx: PrismaTransaction,
    departmentId: number,
  ): Promise<DepartmentModel | null> {
    const departments = (await tx.$queryRawUnsafe(`SELECT *
                                                   FROM "${TableName.DEPARTMENT}"
                                                   WHERE id = ${departmentId} FOR UPDATE`)) as Array<DepartmentModel>;
    if (departments.length == 0) {
      return null;
    }

    return mapPrismaQueryRawObject<DepartmentModel>(departments[0]);
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    departmentId: number,
    error?: Error,
  ): Promise<DepartmentModel> {
    const department = await this.selectForUpdateById(tx, departmentId);

    if (!department) {
      throw error || new RecordNotFoundException();
    }

    return department;
  }
}
