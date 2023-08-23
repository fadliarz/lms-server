import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import { BaseCourseAuthorization } from "./BaseCourseAuthorization";

export default class BaseCourseLessonAuthorization extends BaseCourseAuthorization {

  protected async getCourseIdByLessonIdOrThrow(
    lessonId: number,
    errorObject?: Error
  ): Promise<number> {
    try {
      const lesson = await this.courseLessonTable.findUnique({
        where: {
          id: lessonId,
        },
        select: {
          courseId: true,
        },
      });

      if (!lesson) {
        throw errorObject || new RecordNotFoundException("Lesson not found!");
      }

      return lesson.courseId;
    } catch (error) {
      throw error;
    }
  }
}
