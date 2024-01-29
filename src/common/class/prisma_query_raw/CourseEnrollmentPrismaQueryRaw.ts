import "reflect-metadata";
import { ICourseEnrollmentPrismaQueryRaw } from "./prisma_query_raw.type";
import { injectable } from "inversify";
import { PrismaTransaction } from "../../types";
import { CourseEnrollment } from "@prisma/client";
import { TableName } from "../../constants/tableName";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";

@injectable()
export default class CourseEnrollmentPrismaQueryRaw
  implements ICourseEnrollmentPrismaQueryRaw
{
  public async selectForUpdateById(
    tx: PrismaTransaction,
    enrollmentId: number,
  ): Promise<CourseEnrollment | null> {
    const enrollments = (await tx.$queryRawUnsafe(`SELECT *
                                                   FROM ${TableName.COURSE_ENROLLMENT}
                                                   WHERE id = ${enrollmentId} FOR UPDATE`)) as Array<CourseEnrollment>;
    if (enrollments.length == 0) {
      return null;
    }

    return enrollments[0];
  }

  public async selectForUpdateByIdOrThrow(
    tx: PrismaTransaction,
    enrollmentId: number,
    error?: Error,
  ): Promise<CourseEnrollment> {
    const enrollment = await this.selectForUpdateById(tx, enrollmentId);

    if (!enrollment) {
      throw error || new RecordNotFoundException();
    }

    return enrollment;
  }

  public async selectForUpdateByUserIdAndCourseId(
    tx: PrismaTransaction,
    userId_courseId: {
      userId: number;
      courseId: number;
    },
  ): Promise<CourseEnrollment | null> {
    const { userId, courseId } = userId_courseId;
    const enrollments = (await tx.$queryRawUnsafe(`SELECT *
                                                   FROM ${TableName.COURSE_ENROLLMENT}
                                                   WHERE userId = ${userId}
                                                     AND courseId = ${courseId} FOR UPDATE`)) as Array<CourseEnrollment>;

    if (enrollments.length == 0) {
      return null;
    }

    return enrollments[0];
  }

  public async selectForUpdateByUserIdAndCourseIdOrThrow(
    tx: PrismaTransaction,
    userId_courseId: {
      userId: number;
      courseId: number;
    },
    error?: Error,
  ): Promise<CourseEnrollment> {
    const enrollment = await this.selectForUpdateByUserIdAndCourseId(
      tx,
      userId_courseId,
    );

    if (!enrollment) {
      throw error || new RecordNotFoundException();
    }

    return enrollment;
  }
}
