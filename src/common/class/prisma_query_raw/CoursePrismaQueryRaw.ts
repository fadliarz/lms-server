import "reflect-metadata";
import { ICoursePrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { PrismaTransaction } from "../../types";
import { Course, User } from "@prisma/client";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";

@injectable()
export default class CoursePrismaQueryRaw implements ICoursePrismaQueryRaw {
  public async selectForUpdateById(
    tx: PrismaTransaction,
    courseId: number,
  ): Promise<Course | null> {
    const courses = (await tx.$queryRawUnsafe(`SELECT *
                                               FROM ${TableName.COURSE}
                                               WHERE id = ${courseId} FOR UPDATE`)) as Array<Course>;
    if (courses.length == 0) {
      return null;
    }

    return courses[0];
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    courseId: number,
    error?: Error,
  ): Promise<Course> {
    const course = await this.selectForUpdateById(tx, courseId);

    if (!course) {
      throw error || new RecordNotFoundException();
    }

    return course;
  }
}
