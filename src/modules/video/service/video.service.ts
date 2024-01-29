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
  @inject(CourseLessonVideoDITypes.REPOSITORY)
  repository: ICourseLessonVideoRepository;

  @inject(CourseLessonDITypes.REPOSITORY)
  lessonRepository: ICourseLessonRepository;

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
    const video = await this.repository.createVideo(resourceId, dto);

    return getValuable(video);
  }

  public async getVideoById(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel> {
    const video = await this.repository.getVideoByIdOrThrow(
      videoId,
      resourceId,
    );

    return getValuable(video);
  }

  public async updateVideoSource(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoSourceDto,
  ): Promise<CourseLessonVideoModel> {
    const updatedVideo = await this.repository.updateVideoSource(
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
    await this.repository.deleteVideo(videoId, resourceId);

    return {};
  }
}
