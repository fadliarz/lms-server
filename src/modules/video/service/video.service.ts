import { injectable, inject } from "inversify";
import { ICourseLessonVideoRepository } from "../repository/video.repository";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoModel,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";
import getValuable from "../../../common/functions/getValuable";
import { ICourseLessonRepository } from "../../lesson/repository/lesson.repository";
import {
  CourseLessonDITypes,
  CourseLessonModel,
} from "../../lesson/lesson.type";
import { PrismaTransaction } from "../../../common/types";
import { CourseLesson, CourseLessonVideo } from "@prisma/client";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { CourseModel } from "../../course/course.type";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import Repository from "../../../common/class/repository/Repository";

export interface ICourseLessonVideoService {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideoModel>;
  getVideoById: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideoModel>;
  updateVideoSource: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoSourceDto,
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonVideoService implements ICourseLessonVideoService {
  @inject(RepositoryDITypes.FACADE)
  repository: IRepository;

  /**
   *
   * All resources existence and their relation should be checked in Repository layer while authorizing because
   * it's necessary to lock the rows while performing the features.
   *
   * So no need to implement those type of business logic in Service layer.
   *
   */

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ): Promise<CourseLessonVideoModel> {
    await this.validateRelationBetweenResources(
      { resourceId },
      new RecordNotFoundException(),
    );

    return await this.repository.courseLessonVideo.createVideo(resourceId, dto);
  }

  public async getVideoById(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel> {
    const resources = await this.validateRelationBetweenResources({
      videoId,
      resourceId,
    });

    if (!resources) {
      throw new RecordNotFoundException();
    }

    return resources.video;
  }

  public async updateVideoSource(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateCourseLessonVideoSourceDto,
  ): Promise<CourseLessonVideoModel> {
    await this.validateRelationBetweenResources(
      { resourceId },
      new RecordNotFoundException(),
    );

    return await this.repository.courseLessonVideo.updateVideoSource(
      videoId,
      resourceId,
      dto,
    );
  }

  public async deleteVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<{}> {
    await this.repository.courseLessonVideo.deleteVideo(videoId, resourceId);

    return {};
  }

  private async validateRelationBetweenResources(
    id: {
      resourceId: CourseLessonVideoResourceId;
    },
    error?: Error,
  ): Promise<{
    course: CourseModel;
    lesson: CourseLessonModel;
  } | null>;
  private async validateRelationBetweenResources(
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    error?: Error,
  ): Promise<{
    course: CourseModel;
    lesson: CourseLessonModel;
    video: CourseLessonVideoModel;
  } | null>;
  private async validateRelationBetweenResources<
    T1 extends {
      resourceId: CourseLessonVideoResourceId;
    },
    T2 extends {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
  >(
    id: T1 | T2,
    error?: Error,
  ): Promise<
    | {
        lesson: CourseLesson;
      }
    | {
        lesson: CourseLessonModel;
        video: CourseLessonVideoModel;
      }
    | null
  > {
    const { resourceId } = id;
    const { courseId, lessonId } = resourceId;

    const lesson = await this.repository.courseLesson.getLessonById(
      lessonId,
      resourceId,
    );

    if (!lesson || lesson.courseId !== courseId) {
      if (error) {
        throw error;
      }

      return null;
    }

    if ((id as T2).videoId) {
      const { videoId } = id as T2;
      const video = await this.repository.courseLessonVideo.getVideoById(
        videoId,
        resourceId,
      );

      if (!video || video.lessonId !== lessonId) {
        if (error) {
          throw error;
        }

        return null;
      }

      if (videoId) {
        return {
          lesson,
          video,
        };
      }
    }

    return { lesson };
  }
}
