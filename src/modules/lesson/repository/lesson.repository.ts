import { CourseLesson, PrismaClient, Role } from "@prisma/client";
import { inject, injectable } from "inversify";
import { CreateCourseLessonDto, UpdateCourseLessonDto } from "../lesson.type";
import { v4 as uuidv4 } from "uuid";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";
import { doMinimumRoleAuthorization } from "../../../common/functions/doMinimumRoleAuthorization";

export interface ICourseLessonRepository {
  deleteLesson: (lessonId: string) => Promise<CourseLesson>;
  isLessonBelongToCourse: (
    lessonId: string,
    courseId: string
  ) => Promise<boolean>;
  updateLesson: (
    lessonId: string,
    lessonDetails: UpdateCourseLessonDto
  ) => Promise<CourseLesson>;
  getUserCourseRole: (userId: string, courseId: string) => Promise<Role>;
  getLessonById: (lessonId: string) => Promise<CourseLesson>;
  createLesson: (
    courseId: string,
    lessonDetails: CreateCourseLessonDto
  ) => Promise<CourseLesson>;
}

@injectable()
export class CourseLessonRepository implements ICourseLessonRepository {
  private readonly courseLessonTable = new PrismaClient().courseLesson;
  private readonly courseEnrollmentTable = new PrismaClient().courseEnrollment;

  public async deleteLesson(lessonId: string): Promise<CourseLesson> {
    try {
      const deletedLesson = await this.courseLessonTable.delete({
        where: {
          id: lessonId,
        },
      });

      return deletedLesson;
    } catch (error) {
      throw error;
    }
  }

  public async isLessonBelongToCourse(
    lessonId: string,
    courseId: string
  ): Promise<boolean> {
    try {
      const { courseId: theCourseId } =
        await this.courseLessonTable.findUniqueOrThrow({
          where: {
            id: lessonId,
          },
        });

      return courseId === theCourseId;
    } catch (error) {
      throw error;
    }
  }

  public async updateLesson(
    lessonId: string,
    lessonDetails: UpdateCourseLessonDto
  ): Promise<CourseLesson> {
    try {
      const lesson = await this.courseLessonTable.findFirstOrThrow({
        where: {
          id: lessonId,
          courseId: "as",
        },
      });

      return lesson;
    } catch (error) {
      throw error;
    }
  }

  public async getUserCourseRole(
    userId: string,
    courseId: string
  ): Promise<Role> {
    try {
      const { role } = await this.courseEnrollmentTable.findUniqueOrThrow({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        select: {
          role: true,
        },
      });

      return role;
    } catch (error) {
      throw error;
    }
  }

  public async createLesson(
    courseId: string,
    lessonDetails: CreateCourseLessonDto
  ): Promise<CourseLesson> {
    try {
      const lesson = await this.courseLessonTable.create({
        data: {
          id: uuidv4(),
          courseId,
          ...lessonDetails,
        },
      });

      return lesson;
    } catch (error) {
      throw error;
    }
  }

  public async getLessonById(lessonId: string): Promise<CourseLesson> {
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
}
