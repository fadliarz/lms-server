import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { BaseCourseAuthorization } from "./BaseCourseAuthorization";

export default class BaseCourseLessonAuthorization extends BaseCourseAuthorization {
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
