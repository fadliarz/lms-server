import { CourseLesson } from "@prisma/client";
import { injectable } from "inversify";
import { CreateCourseLessonDto, UpdateCourseLessonDto } from "../lesson.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export interface ICourseLessonRepository {
  delete: (lessonId: number, courseId: number) => Promise<CourseLesson>;
  update: (
    lessonId: number,
    courseId: number,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLesson>;
  getById: (lessonId: number) => Promise<CourseLesson>;
  create: (lessonDetails: CreateCourseLessonDto) => Promise<CourseLesson>;
}

@injectable()
export class CourseLessonRepository implements ICourseLessonRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseLessonTable = this.prisma.courseLesson;
  private readonly courseTable = this.prisma.course;

  public async delete(
    lessonId: number,
    courseId: number
  ): Promise<CourseLesson> {
    try {
      const deletedLesson = await this.prisma.$transaction(async (tx) => {
        const deletedLesson = await tx.courseLesson.findUniqueOrThrow({
          where: {
            id: lessonId,
          },
        });

        await Promise.all([
          tx.courseLesson.delete({
            where: {
              id: lessonId,
            },
          }),
          tx.courseLessonVideo.deleteMany({
            where: {
              lessonId,
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
    } catch (error) {
      throw error;
    }
  }

  public async update(
    lessonId: number,
    courseId: number,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLesson> {
    try {
      const lesson = await this.courseLessonTable.update({
        where: {
          id_courseId: {
            id: lessonId,
            courseId,
          },
        },
        data: lessonDetails,
      });

      return lesson;
    } catch (error) {
      throw error;
    }
  }

  public async getById(lessonId: number): Promise<CourseLesson> {
    try {
      const lesson = await this.courseLessonTable.findUniqueOrThrow({
        where: {
          id: lessonId,
        },
      });

      return lesson;
    } catch (error) {
      throw error;
    }
  }

  public async create(
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLesson> {
    try {
      const [lesson] = await this.prisma.$transaction([
        this.courseLessonTable.create({
          data: {
            ...lessonDetails,
          },
        }),
        this.courseTable.update({
          where: {
            id: lessonDetails.courseId,
          },
          data: {
            totalLessons: { increment: 1 },
          },
        }),
      ]);

      return lesson;
    } catch (error) {
      throw error;
    }
  }
}
