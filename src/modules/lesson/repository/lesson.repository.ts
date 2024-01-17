import { CourseLesson } from "@prisma/client";
import { injectable } from "inversify";
import { CreateCourseLessonDto, UpdateCourseLessonDto } from "../lesson.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export interface ICourseLessonRepository {
  createLesson: (
    courseId: number,
    dto: CreateCourseLessonDto
  ) => Promise<CourseLesson>;
  getLessonById: (courseId: number, lessonId: number) => Promise<CourseLesson>;
  updateLesson: (
    lessonId: number,
    dto: UpdateCourseLessonDto
  ) => Promise<CourseLesson>;
  deleteLesson: (courseId: number, lessonId: number) => Promise<{}>;
}

@injectable()
export class CourseLessonRepository implements ICourseLessonRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseLessonTable = this.prisma.courseLesson;
  private readonly courseTable = this.prisma.course;

  public async createLesson(
    courseId: number,
    dto: CreateCourseLessonDto
  ): Promise<CourseLesson> {
    const [lesson] = await this.prisma.$transaction([
      this.courseLessonTable.create({
        data: {
          ...dto,
          courseId,
        },
      }),
      this.courseTable.update({
        where: {
          id: courseId,
        },
        data: {
          totalLessons: { increment: 1 },
        },
      }),
    ]);

    return lesson;
  }

  public async getLessonById(
    courseId: number,
    lessonId: number
  ): Promise<CourseLesson> {
    const lesson = await this.courseLessonTable.findUniqueOrThrow({
      where: {
        id: lessonId,
        courseId,
      },
    });

    return lesson;
  }

  public async updateLesson(
    lessonId: number,
    dto: UpdateCourseLessonDto
  ): Promise<CourseLesson> {
    const lesson = await this.courseLessonTable.update({
      where: {
        id: lessonId,
      },
      data: dto,
    });

    return lesson;
  }

  public async deleteLesson(
    courseId: number,
    lessonId: number
  ): Promise<CourseLesson> {
    const deletedLesson = await this.prisma.$transaction(async (tx) => {
      const deletedLesson = await tx.courseLesson.findUniqueOrThrow({
        where: {
          id: lessonId,
        },
      });

      await tx.courseLessonVideo.deleteMany({
        where: {
          lessonId,
        },
      });

      await Promise.all([
        tx.courseLesson.delete({
          where: {
            id: lessonId,
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalDurations: { decrement: deletedLesson.totalDurations },
            totalLessons: { decrement: 1 },
          },
        }),
      ]);

      return deletedLesson;
    });

    return deletedLesson;
  }
}
