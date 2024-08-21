import "reflect-metadata";
import { injectable } from "inversify";
import {
  $CourseLessonVideoAPI,
  CourseLessonVideoModel,
  CourseLessonVideoResourceId,
} from "../video.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseLessonVideoRepository } from "../video.interface";
import BaseRepository from "../../../common/class/BaseRepository";

@injectable()
export default class CourseLessonVideoRepository
  extends BaseRepository
  implements ICourseLessonVideoRepository
{
  constructor() {
    super();
  }

  public async createVideo(
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonVideoResourceId, "lessonId">;
    },
    data: $CourseLessonVideoAPI.CreateVideo.Dto,
  ): Promise<CourseLessonVideoModel> {
    const { lessonId, resourceId } = id;

    if (resourceId) {
      this.db.courseLesson.findFirst({
        where: {
          id: lessonId,
          course: {
            id: resourceId.courseId,
          },
        },
      });
    }

    return this.db.courseLessonVideo.create({
      data: {
        ...data,
        lessonId,
      },
    });
  }

  public async getVideos(id: {
    lessonId: number;
    resourceId?: Omit<CourseLessonVideoResourceId, "lessonId">;
  }): Promise<CourseLessonVideoModel[]> {
    return this.db.courseLessonVideo.findMany({
      where: this.getWhereObjectForFirstLevelOperation(id),
    });
  }

  public async getVideoById(id: {
    videoId: number;
    resourceId?: CourseLessonVideoResourceId;
  }): Promise<CourseLessonVideoModel | null> {
    return this.db.courseLessonVideo.findUnique({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  public async getVideoByIdOrThrow(
    id: {
      videoId: number;
      resourceId?: CourseLessonVideoResourceId;
    },
    error?: Error,
  ): Promise<CourseLessonVideoModel> {
    const video = await this.getVideoById(id);

    if (!video) {
      throw error || new RecordNotFoundException();
    }

    return video;
  }

  public async updateVideo(
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    data: Partial<CourseLessonVideoModel>,
  ) {
    return this.db.courseLessonVideo.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteVideo(id: {
    videoId: number;
    resourceId: CourseLessonVideoResourceId;
  }): Promise<{}> {
    return this.db.courseLessonVideo.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
      select: {},
    });
  }

  private getWhereObjectForFirstLevelOperation(id: {
    lessonId: number;
    resourceId?: Omit<CourseLessonVideoResourceId, "lessonId">;
  }):
    | {
        id: number;
      }
    | {
        id: number;
        course: {
          id: number;
        };
      } {
    if (id.resourceId) {
      return {
        id: id.lessonId,
        course: {
          id: id.resourceId.courseId,
        },
      };
    }

    return {
      id: id.lessonId,
    };
  }

  private getWhereObjectForSecondLevelOperation(id: {
    videoId: number;
    resourceId?: CourseLessonVideoResourceId;
  }):
    | { id: number }
    | { id: number; lesson: { id: number; course: { id: number } } } {
    const { videoId, resourceId } = id;

    if (resourceId) {
      return {
        id: videoId,
        lesson: {
          id: resourceId.lessonId,
          course: { id: resourceId.courseId },
        },
      };
    }

    return { id: videoId };
  }
}
