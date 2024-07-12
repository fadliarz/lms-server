import { inject, injectable } from "inversify";
import {
  CourseLessonVideoModel,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  UpdateBasicCourseLessonVideoDto,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";
import { CourseLessonModel } from "../../lesson/lesson.type";
import { CourseLesson } from "@prisma/client";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { CourseModel } from "../../course/course.type";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";

export interface ICourseLessonVideoService {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideoModel>;
  getVideoById: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideoModel>;
  getVideos: (
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideoModel[]>;
  updateBasicVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateBasicCourseLessonVideoDto,
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

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ): Promise<CourseLessonVideoModel> {
    try {
      await this.validateRelationBetweenResources({ resourceId });

      return await this.repository.courseLessonVideo.createVideo(
        resourceId,
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error, {
        foreignConstraint: {
          default: { message: "lesson doesn't exist!" },
        },
      });
    }
  }

  public async getVideoById(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel> {
    const { video } = await this.validateRelationBetweenResources({
      videoId,
      resourceId,
    });

    return video;
  }

  public async getVideos(
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel[]> {
    await this.validateRelationBetweenResources({ resourceId });

    return await this.repository.courseLessonVideo.getVideos(resourceId);
  }

  public async updateBasicVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateBasicCourseLessonVideoDto,
  ): Promise<CourseLessonVideoModel> {
    await this.validateRelationBetweenResources({ resourceId });

    return await this.repository.courseLessonVideo.updateVideo(
      videoId,
      resourceId,
      dto,
    );
  }

  public async updateVideoSource(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateCourseLessonVideoSourceDto,
  ): Promise<CourseLessonVideoModel> {
    await this.validateRelationBetweenResources({ resourceId });

    return await this.repository.courseLessonVideo.updateVideo(
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

  private async validateRelationBetweenResources(id: {
    resourceId: CourseLessonVideoResourceId;
  }): Promise<{
    course: CourseModel;
    lesson: CourseLessonModel;
  }>;
  private async validateRelationBetweenResources(id: {
    videoId: number;
    resourceId: CourseLessonVideoResourceId;
  }): Promise<{
    course: CourseModel;
    lesson: CourseLessonModel;
    video: CourseLessonVideoModel;
  }>;
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
  ): Promise<
    | {
        lesson: CourseLesson;
      }
    | {
        lesson: CourseLessonModel;
        video: CourseLessonVideoModel;
      }
  > {
    const { resourceId } = id;
    const { courseId, lessonId } = resourceId;

    const lesson = await this.repository.courseLesson.getLessonById(
      lessonId,
      resourceId,
    );

    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException("lesson doesn't exist!");
    }

    if ((id as T2).videoId) {
      const { videoId } = id as T2;
      const video = await this.repository.courseLessonVideo.getVideoById(
        videoId,
        resourceId,
      );

      if (!video || video.lessonId !== lessonId) {
        throw new RecordNotFoundException("video doesn't exist!");
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
