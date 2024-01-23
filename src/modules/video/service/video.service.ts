import { injectable, inject } from "inversify";
import { ICourseLessonVideoRepository } from "../repository/video.repository";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoModel,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import getValuable from "../../../common/functions/getValuable";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ICourseLessonRepository } from "../../lesson/repository/lesson.repository";
import { CourseLessonDITypes } from "../../lesson/lesson.type";

export interface ICourseLessonVideoService {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideoModel>;
  getVideoById: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideoModel>;
  updateVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonVideoService implements ICourseLessonVideoService {
  @inject(CourseLessonVideoDITypes.REPOSITORY)
  repository: ICourseLessonVideoRepository;

  @inject(CourseLessonDITypes.REPOSITORY)
  lessonRepository: ICourseLessonRepository;

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ): Promise<CourseLessonVideoModel> {
    await this.validateVideo(resourceId);

    const video = await this.repository.createVideo(resourceId, dto);

    return getValuable(video);
  }

  public async getVideoById(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel> {
    await this.validateResource(videoId, resourceId);

    const video = await this.repository.getVideoByIdOrThrow(videoId);

    return getValuable(video);
  }

  public async updateVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoDto,
  ): Promise<CourseLessonVideoModel> {
    await this.validateResource(videoId, resourceId);

    const updatedVideo = await this.repository.updateVideo(
      videoId,
      resourceId,
      videoDetails,
    );

    return getValuable(updatedVideo);
  }

  public async deleteVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<{}> {
    await this.validateResource(videoId, resourceId);

    await this.repository.deleteVideo(videoId, resourceId);

    return {};
  }

  private async validateResource(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<void> {
    const { courseId, lessonId } = resourceId;
    const video = await this.repository.getVideoById(videoId);
    if (!video || video.lessonId !== lessonId) {
      throw new RecordNotFoundException();
    }

    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException();
    }
  }

  private async validateVideo(
    resourceId: CourseLessonVideoResourceId,
  ): Promise<void> {
    const { courseId, lessonId } = resourceId;
    const lesson = await this.lessonRepository.getLessonById(lessonId);
    if (!lesson || lesson.courseId !== courseId) {
      throw new RecordNotFoundException();
    }
  }
}
