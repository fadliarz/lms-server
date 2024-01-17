import { CourseLessonModel } from "../../modules/lesson/lesson.type";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import getValuable from "../functions/getValuable";
import { BaseCourseAuthorization } from "./BaseCourseAuthorization";

export default class BaseCourseLessonAuthorization extends BaseCourseAuthorization {
  protected async getLessonById(
    courseId: number,
    lessonId: number
  ): Promise<CourseLessonModel | null> {
    try {
      const lesson = await this.prisma.courseLesson.findUnique({
        where: {
          id: lessonId,
          courseId: courseId,
        },
      });

      return lesson ? getValuable(lesson) : lesson;
    } catch (error) {
      throw error;
    }
  }

  protected async getLessonByIdOrThrow(
    courseId: number,
    lessonId: number
  ): Promise<CourseLessonModel | null> {
    try {
      const lesson = await this.prisma.courseLesson.findUnique({
        where: {
          id: lessonId,
          courseId: courseId,
        },
      });

      if (!lesson) {
        throw new RecordNotFoundException();
      }

      return getValuable(lesson);
    } catch (error) {
      throw error;
    }
  }

  protected async getCourseIdByLessonId(
    lessonId: number
  ): Promise<number | null> {
    try {
      const lesson = await this.courseLessonTable.findUnique({
        where: {
          id: lessonId,
        },
        select: {
          courseId: true,
        },
      });

      return lesson ? lesson.courseId : null;
    } catch (error) {
      throw error;
    }
  }

  protected async getCourseIdByLessonIdOrThrow(
    lessonId: number,
    errorObject?: Error
  ): Promise<number> {
    try {
      const courseId = await this.getCourseIdByLessonId(lessonId);
      if (!courseId) {
        throw errorObject ? errorObject : new RecordNotFoundException();
      }

      return courseId;
    } catch (error) {
      throw error;
    }
  }
}
