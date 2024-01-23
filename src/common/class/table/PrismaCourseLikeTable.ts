import "reflect-metadata";
import { injectable } from "inversify";
import { ICourseLikeTable } from "./table.type";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { PrismaClient } from "@prisma/client";
import getValuable from "../../functions/getValuable";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { CourseLikeModel } from "../../../modules/course/course.type";

@injectable()
export default class PrismaCourseLikeTable implements ICourseLikeTable {
  private readonly prisma: PrismaClient = PrismaClientSingleton.getInstance();

  public async findUnique(likeId: number): Promise<CourseLikeModel | null> {
    const like = await this.prisma.courseLessonVideo.findUnique({
      where: {
        id: likeId,
      },
    });

    return like ? getValuable(like) : like;
  }

  public async findUniqueOrThrow(
    likeId: number,
    errorObject?: Error
  ): Promise<CourseLikeModel> {
    const like = await this.findUnique(likeId);

    if (!like) {
      throw errorObject || new RecordNotFoundException();
    }

    return getValuable(like);
  }
}
