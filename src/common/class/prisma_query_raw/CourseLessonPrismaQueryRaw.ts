import "reflect-metadata";
import { ICourseLessonPrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { CourseLesson } from "@prisma/client";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { mapPrismaQueryRawObject } from "./prisma_query_raw.utils";
import { PrismaTransaction } from "../../types";

@injectable()
export default class CourseLessonPrismaQueryRaw
  implements ICourseLessonPrismaQueryRaw
{
  public async selectForUpdateById(
    tx: PrismaTransaction,
    lessonId: number,
  ): Promise<CourseLesson | null> {
    const lessons = (await tx.$queryRawUnsafe(`SELECT *
                                               FROM ${TableName.COURSE_LESSON}
                                               WHERE id = ${lessonId} FOR UPDATE`)) as Array<CourseLesson>;
    if (lessons.length == 0) {
      return null;
    }

    return mapPrismaQueryRawObject<CourseLesson>(lessons[0]);
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    lessonId: number,
    error?: Error,
  ): Promise<CourseLesson> {
    const lesson = await this.selectForUpdateById(tx, lessonId);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }
}
