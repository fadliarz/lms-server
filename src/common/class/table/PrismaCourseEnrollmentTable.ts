import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import PrismaClientSingleton from "../PrismaClientSingleton";
import getValuable from "../../functions/getValuable";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { injectable } from "inversify";
import { ICourseEnrollmentTable } from "./table.type";
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";

@injectable()
export default class PrismaCourseEnrollmentTable
  implements ICourseEnrollmentTable
{
  private readonly prisma: PrismaClient = PrismaClientSingleton.getInstance();

  public async findUnique(
    enrollmentId: number,
  ): Promise<CourseEnrollmentModel | null> {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        id: enrollmentId,
      },
    });

    return enrollment ? getValuable(enrollment) : enrollment;
  }

  public async findUniqueOrThrow(
    enrollmentId: number,
    errorObject?: Error,
  ): Promise<CourseEnrollmentModel> {
    const enrollment = await this.findUnique(enrollmentId);

    if (!enrollment) {
      throw errorObject || new RecordNotFoundException();
    }

    return getValuable(enrollment);
  }

  public async findUniqueByUserIdAndCourseId(
    userId: number,
    courseId: number,
  ): Promise<CourseEnrollmentModel | null> {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return enrollment ? getValuable(enrollment) : enrollment;
  }

  public async findUniqueByUserIdAndCourseIdOrThrow(
    userId: number,
    courseId: number,
    error?: Error,
  ): Promise<CourseEnrollmentModel> {
    const enrollment = await this.findUniqueByUserIdAndCourseId(
      userId,
      courseId,
    );

    if (!enrollment) {
      throw error || new RecordNotFoundException();
    }

    return getValuable(enrollment);
  }

  public async delete(enrollmentId: number): Promise<CourseEnrollmentModel> {
    const deletedEnrollment = await this.prisma.courseEnrollment.delete({
      where: { id: enrollmentId },
    });

    return getValuable(deletedEnrollment);
  }
}
