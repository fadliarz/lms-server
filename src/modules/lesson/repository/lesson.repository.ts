import { CourseLesson, PrismaClient } from "@prisma/client";
import { injectable } from "inversify";
import { CreateCourseLessonDto, UpdateCourseLessonDto } from "../lesson.type";
import dIContainer from "../../../inversifyConfig";
import { databaseDITypes } from "../../../common/constants/databaseDITypes";

export interface ICourseLessonRepository {
  deleteLesson: (lessonId: number, courseId: number) => Promise<CourseLesson>;
  updateLesson: (
    lessonId: number,
    courseId: number,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLesson>;
  getLessonById: (lessonId: number) => Promise<CourseLesson>;
  createLesson: (
    courseId: number,
    lessonDetails: CreateCourseLessonDto
  ) => Promise<CourseLesson>;
}

@injectable()
export class CourseLessonRepository implements ICourseLessonRepository {
  private readonly prisma = dIContainer.get<PrismaClient>(
    databaseDITypes.PRISMA_CLIENT
  );
  private readonly courseLessonTable = this.prisma.courseLesson;
  private readonly courseTable = this.prisma.course;

  public async deleteLesson(
    courseId: number,
    lessonId: number
  ): Promise<CourseLesson> {
    try {
      const deletedLesson = await this.prisma.$transaction(async (tx) => {
        const deletedLesson = await tx.courseLesson.delete({
          where: {
            id: lessonId,
          },
        });

        await tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalDurations: { decrement: deletedLesson.totalDurations },
            totalLessons: { decrement: 1 },
          },
        });

        return deletedLesson;
      });

      return deletedLesson;
    } catch (error) {
      throw error;
    }
  }

  public async updateLesson(
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

  public async getLessonById(lessonId: number): Promise<CourseLesson> {
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

  public async createLesson(
    courseId: number,
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLesson> {
    try {
      const [lesson] = await this.prisma.$transaction([
        this.courseLessonTable.create({
          data: {
            courseId,
            ...lessonDetails,
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
    } catch (error) {
      throw error;
    }
  }
}
