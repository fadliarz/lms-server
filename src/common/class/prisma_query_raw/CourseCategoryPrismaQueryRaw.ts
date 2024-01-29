import "reflect-metadata";
import { ICourseCategoryPrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { PrismaTransaction } from "../../types";
import { CourseCategory } from "@prisma/client";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";

@injectable()
export default class CourseCategoryPrismaQueryRaw
  implements ICourseCategoryPrismaQueryRaw
{
  public async selectForUpdateById(
    tx: PrismaTransaction,
    categoryId: number,
  ): Promise<CourseCategory | null> {
    const categories = (await tx.$queryRawUnsafe(`SELECT *
                                                  FROM ${TableName.COURSE_CATEGORY}
                                                  WHERE id = ${categoryId} FOR UPDATE`)) as Array<CourseCategory>;
    if (categories.length == 0) {
      return null;
    }

    return categories[0];
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    categoryId: number,
    error?: Error,
  ): Promise<CourseCategory> {
    const category = await this.selectForUpdateById(tx, categoryId);

    if (!category) {
      throw error || new RecordNotFoundException();
    }

    return category;
  }
}
