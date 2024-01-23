import { CourseLesson } from "@prisma/client";
import { injectable } from "inversify";
import {
  CourseLessonResourceId,
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../lesson.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

export interface ICourseLessonRepository {
  createLesson: (
    courseId: number,
    dto: CreateCourseLessonDto,
  ) => Promise<CourseLesson>;
  getLessonById: (lessonId: number) => Promise<CourseLesson | null>;
  getLessonByIdOrThrow: (
    lessonId: number,
    error?: Error,
  ) => Promise<CourseLesson>;
  updateLesson: (
    lessonId: number,
    dto: UpdateCourseLessonDto,
  ) => Promise<CourseLesson>;
  deleteLesson: (
    lessonId: number,
    resource: CourseLessonResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonRepository implements ICourseLessonRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseLessonTable = this.prisma.courseLesson;
  private readonly courseTable = this.prisma.course;

  public async createLesson(
    courseId: number,
    dto: CreateCourseLessonDto,
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

  public async getLessonById(lessonId: number): Promise<CourseLesson | null> {
    const lesson = await this.courseLessonTable.findUnique({
      where: {
        id: lessonId,
      },
    });

    return lesson;
  }

  public async getLessonByIdOrThrow(
    lessonId: number,
    error?: Error,
  ): Promise<CourseLesson> {
    const lesson = await this.getLessonById(lessonId);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }

  public async updateLesson(
    lessonId: number,
    dto: UpdateCourseLessonDto,
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
    lessonId: number,
    resource: CourseLessonResourceId,
  ): Promise<CourseLesson> {
    const { courseId } = resource;
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
