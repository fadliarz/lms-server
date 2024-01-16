import { CourseLessonVideo } from "@prisma/client";
import RecordNotFoundException from "../exceptions/RecordNotFoundException";
import BaseCourseLessonAuthorization from "./BaseCourseLessonAuthorization";

export default class BaseCourseLessonVideoAuthorization extends BaseCourseLessonAuthorization {
  protected async getLessonIdByVideoIdOrThrow(
    videoId: number,
    errorObject?: Error
  ): Promise<number> {
    try {
      const lessonId = await this.getLessonIdByVideoId(videoId);

      if (!lessonId) {
        throw errorObject || new RecordNotFoundException("Lesson not found!");
      }

      return lessonId;
    } catch (error) {
      throw error;
    }
  }

  protected async getLessonIdByVideoId(
    videoId: number
  ): Promise<number | null> {
    try {
      const video = await this.courseLessonVideoTable.findUnique({
        where: {
          id: videoId,
        },
        select: {
          lessonId: true,
        },
      });

      return video ? video.lessonId : null;
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
