import "reflect-metadata";
import { injectable } from "inversify";
import { ICourseLessonTable } from "./table.type";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { CourseLessonModel } from "../../../modules/lesson/lesson.type";
import { PrismaClient } from "@prisma/client";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";

@injectable()
export default class PrismaCourseLessonTable implements ICourseLessonTable {
  private readonly prisma: PrismaClient = PrismaClientSingleton.getInstance();

  public async findUnique(lessonId: number): Promise<CourseLessonModel | null> {
    const lesson = await this.prisma.courseLesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    return lesson;
  }

  public async findUniqueOrThrow(
    lessonId: number,
    errorObject?: Error,
  ): Promise<CourseLessonModel> {
    const lesson = await this.findUnique(lessonId);

    if (!lesson) {
      throw errorObject || new RecordNotFoundException();
    }

    return lesson;
  }
}
