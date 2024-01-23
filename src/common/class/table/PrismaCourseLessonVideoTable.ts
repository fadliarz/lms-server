import "reflect-metadata";
import { injectable } from "inversify";
import { ICourseLessonVideoTable } from "./table.type";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { PrismaClient } from "@prisma/client";
import getValuable from "../../functions/getValuable";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { CourseLessonVideoModel } from "../../../modules/video/video.type";

@injectable()
export default class PrismaCourseLessonVideoTable
  implements ICourseLessonVideoTable
{
  private readonly prisma: PrismaClient = PrismaClientSingleton.getInstance();

  public async findUnique(
    videoId: number
  ): Promise<CourseLessonVideoModel | null> {
    const video = await this.prisma.courseLessonVideo.findUnique({
      where: {
        id: videoId,
      },
    });

    return video ? getValuable(video) : video;
  }

  public async findUniqueOrThrow(
    videoId: number,
    errorObject?: Error
  ): Promise<CourseLessonVideoModel> {
    const video = await this.findUnique(videoId);

    if (!video) {
      throw errorObject || new RecordNotFoundException();
    }

    return getValuable(video);
  }
}
