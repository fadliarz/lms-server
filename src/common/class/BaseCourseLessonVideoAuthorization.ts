import { CourseLessonVideo } from "@prisma/client";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import BaseCourseLessonAuthorization from "./BaseCourseLessonAuthorization";

export default class BaseCourseLessonVideoAuthorization extends BaseCourseLessonAuthorization {
  protected async getLessonIdByVideoIdOrThrow(
    videoId: number,
    errorObject?: Error
  ): Promise<number> {
    try {
      const video = await this.courseLessonVideoTable.findUniqueOrThrow({
        where: {
          id: videoId,
        },
        select: {
          lessonId: true,
        },
      });

      if (!video) {
        throw errorObject || new RecordNotFoundException("Lesson not found!");
      }

      return video.lessonId;
    } catch (error) {
      throw error;
    }
  }

  protected async getVideoById(
    videoId: number,
    errorObject?: Error
  ): Promise<CourseLessonVideo> {
    try {
      const video = await this.courseLessonVideoTable.findUnique({
        where: {
          id: videoId,
        },
      });

      if (!video) {
        throw errorObject || new RecordNotFoundException("Video not found!");
      }

      return video;
    } catch (error) {
      throw error;
    }
  }
}
