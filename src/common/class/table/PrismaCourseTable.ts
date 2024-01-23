import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { CourseModel } from "../../../modules/course/course.type";
import getValuable from "../../functions/getValuable";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { injectable } from "inversify";
import { ICourseTable } from "./table.type";

@injectable()
export default class PrismaCourseTable implements ICourseTable {
  private readonly prisma: PrismaClient = PrismaClientSingleton.getInstance();

  public async findUnique(courseId: number): Promise<CourseModel | null> {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    return course ? getValuable(course) : course;
  }

  public async findUniqueOrThrow(
    courseId: number,
    errorObject?: Error
  ): Promise<CourseModel> {
    const course = await this.findUnique(courseId);

    if (!course) {
      throw errorObject || new RecordNotFoundException();
    }

    return getValuable(course);
  }

  public async delete(courseId: number): Promise<CourseModel> {
    const deletedCourse = await this.prisma.course.delete({
      where: { id: courseId },
    });

    return getValuable(deletedCourse);
  }
}
