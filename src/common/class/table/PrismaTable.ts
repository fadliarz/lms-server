import { inject, injectable } from "inversify";
import {
  ICourseEnrollmentTable,
  ICourseLessonTable,
  ICourseLessonVideoTable,
  ICourseLikeTable,
  ICourseTable,
  ITable,
} from "./table.type";

export const PrismaTableDITypes = {
  TABLE: Symbol.for("PRISMA_TABLE"),
  COURSE: Symbol.for("PRISMA_COURSE_TABLE"),
  COURSE_ENROLLMENT: Symbol.for("PRISMA_COURSE_ENROLLMENT_TABLE"),
  COURSE_LESSON: Symbol.for("PRISMA_COURSE_LESSON_TABLE"),
  COURSE_LESSON_VIDEO: Symbol.for("PRISMA_COURSE_LESSON_VIDEO_TABLE"),
  COURSE_LIKE: Symbol.for("PRISMA_COURSE_LIKE_TABLE"),
};

@injectable()
export default class PrismaTable implements ITable {
  @inject(PrismaTableDITypes.COURSE)
  public readonly course: ICourseTable;

  @inject(PrismaTableDITypes.COURSE_ENROLLMENT)
  public readonly courseEnrollment: ICourseEnrollmentTable;

  @inject(PrismaTableDITypes.COURSE_LESSON)
  public readonly courseLesson: ICourseLessonTable;

  @inject(PrismaTableDITypes.COURSE_LESSON_VIDEO)
  public readonly courseLessonVideo: ICourseLessonVideoTable;

  @inject(PrismaTableDITypes.COURSE_LIKE)
  public readonly courseLike: ICourseLikeTable;
}
