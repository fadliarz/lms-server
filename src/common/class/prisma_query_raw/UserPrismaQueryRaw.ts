import "reflect-metadata";
import { IUserPrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { PrismaTransaction } from "../../types";
import { Course, User } from "@prisma/client";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { mapPrismaQueryRawObject } from "./prisma_query_raw.utils";

@injectable()
export default class UserPrismaQueryRaw implements IUserPrismaQueryRaw {
  public async selectForUpdateById(
    tx: PrismaTransaction,
    userId: number,
  ): Promise<User | null> {
    const users = (await tx.$queryRawUnsafe(`SELECT *
                                             FROM "${TableName.USER}"
                                             WHERE id = ${userId} FOR UPDATE`)) as Array<User>;
    if (users.length == 0) {
      return null;
    }

    return mapPrismaQueryRawObject<User>(users[0]);
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    userId: number,
    error?: Error,
  ): Promise<User> {
    const user = await this.selectForUpdateById(tx, userId);

    if (!user) {
      throw error || new RecordNotFoundException();
    }

    return user;
  }
}
