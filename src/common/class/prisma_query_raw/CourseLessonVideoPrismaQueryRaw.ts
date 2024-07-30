import "reflect-metadata";
import { ICourseLessonVideoPrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { CourseLessonVideo } from "@prisma/client";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { mapPrismaQueryRawObject } from "./prisma_query_raw.utils";
import { PrismaTransaction } from "../../types";

@injectable()
export default class CourseLessonVideoPrismaQueryRaw
  implements ICourseLessonVideoPrismaQueryRaw
{
  public async selectForUpdateById(
    tx: PrismaTransaction,
    videoId: number,
  ): Promise<CourseLessonVideo | null> {
    const videos = (await tx.$queryRawUnsafe(`SELECT *
                                              FROM ${TableName.COURSE_LESSON_VIDEO}
                                              WHERE id = ${videoId} FOR UPDATE`)) as Array<CourseLessonVideo>;
    if (videos.length == 0) {
      return null;
    }

    return mapPrismaQueryRawObject<CourseLessonVideo>(videos[0]);
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    videoId: number,
    error?: Error,
  ): Promise<CourseLessonVideo> {
    const video = await this.selectForUpdateById(tx, videoId);

    if (!video) {
      throw error || new RecordNotFoundException();
    }

    return video;
  }
}
