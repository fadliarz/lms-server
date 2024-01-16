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

export interface ICourseLessonVideoService {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
  getVideoById: (
    resourceId: CourseLessonVideoResourceId
  ) => Promise<CourseLessonVideoModel>;
  updateVideo: (
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (resourceId: CourseLessonVideoResourceId) => Promise<{}>;
}

@injectable()
export class CourseLessonVideoService implements ICourseLessonVideoService {
  @inject(CourseLessonVideoDITypes.REPOSITORY)
  repository: ICourseLessonVideoRepository;

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    const video = await this.repository.createVideo(resourceId, videoDetails);

    return getValuable(video);
  }

  public async getVideoById(
    resourceId: CourseLessonVideoResourceId
  ): Promise<CourseLessonVideoModel> {
    const video = await this.repository.getVideoById(resourceId);

    return getValuable(video);
  }

  public async updateVideo(
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    const updatedVideo = await this.repository.updateVideo(
      resourceId,
      videoDetails
    );

    return getValuable(updatedVideo);
  }

  public async deleteVideo(
    resourceId: CourseLessonVideoResourceId
  ): Promise<{}> {
    await this.repository.deleteVideo(resourceId);

    return {};
  }
}
