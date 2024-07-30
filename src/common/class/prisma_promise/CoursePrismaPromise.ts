import "reflect-metadata";
import { CoursePromise, ICoursePrismaPromise } from "./prisma_promise.type";
import { injectable } from "inversify";
import { PrismaTransaction } from "../../types";

@injectable()
export default class CoursePrismaPromise implements ICoursePrismaPromise {
  public incrementTotalStudents(
    tx: PrismaTransaction,
    courseId: number,
    increment: number,
  ): CoursePromise {
    return tx.course.update({
      where: {
        id: courseId,
      },
      data: {
        totalStudents: {
          increment,
        },
      },
    });
  }

  public incrementTotalInstructors(
    tx: PrismaTransaction,
    courseId: number,
    increment: number,
  ): CoursePromise {
    return tx.course.update({
      where: {
        id: courseId,
      },
      data: {
        totalInstructors: {
          increment,
        },
      },
    });
  }

  public incrementTotalLessons(
    tx: PrismaTransaction,
    courseId: number,
    increment: number,
  ): CoursePromise {
    return tx.course.update({
      where: {
        id: courseId,
      },
      data: {
        totalLessons: {
          increment,
        },
      },
    });
  }
}
