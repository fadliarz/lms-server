import { injectable, inject } from "inversify";
import { ICourseLessonVideoRepository } from "../repository/video.repository";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoModel,
  CreateCourseLessonVideoDto,
  CreateCourseLessonVideoIds,
  DeleteCourseLessonVideoIds,
  UpdateCourseLessonVideoDto,
  UpdateCourseLessonVideoIds,
} from "../video.type";
import getValuable from "../../../common/functions/getValuable";
import { CourseLessonVideo } from "@prisma/client";

export interface ICourseLessonVideoService {
  delete: (
    ids: DeleteCourseLessonVideoIds,
    video: CourseLessonVideo
  ) => Promise<CourseLessonVideoModel>;
  update: (
    ids: UpdateCourseLessonVideoIds,
    video: CourseLessonVideo,
    newVideoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
  create: (
    ids: CreateCourseLessonVideoIds,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
}

@injectable()
export class CourseLessonVideoService implements ICourseLessonVideoService {
  @inject(CourseLessonVideoDITypes.REPOSITORY)
  repository: ICourseLessonVideoRepository;

  public async delete(
    ids: DeleteCourseLessonVideoIds,
    video: CourseLessonVideo
  ): Promise<CourseLessonVideoModel> {
    try {
      const deletedVideo = await this.repository.delete(ids, video);

      return getValuable(deletedVideo);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    ids: UpdateCourseLessonVideoIds,
    video: CourseLessonVideo,
    newVideoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    try {
      const updatedVideo = await this.repository.update(ids, video, newVideoDetails);

      return getValuable(updatedVideo);
    } catch (error) {
      throw error;
    }
  }

  public async create(
    ids: CreateCourseLessonVideoIds,
    newVideoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    try {
      const video = await this.repository.create(ids, newVideoDetails);

      return getValuable(video);
    } catch (error) {
      throw error;
    }
  }
}
