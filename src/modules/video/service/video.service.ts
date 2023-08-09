import { injectable, inject } from "inversify";
import { ICourseLessonVideoRepository } from "../repository/video.repository";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoModel,
  CreateCourseLessonVideoDto,
  CourseLessonVideoParams,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import { getValuable } from "../../../common/functions/getValuable";

export interface ICourseLessonVideoService {
  updateVideo: (
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (
    params: CourseLessonVideoParams
  ) => Promise<CourseLessonVideoModel>;
  createVideo: (
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
}

@injectable()
export class CourseLessonVideoService implements ICourseLessonVideoService {
  @inject(CourseLessonVideoDITypes.COURSE_LESSON_VIDEO_REPOSITORY)
  courseLessonVideoRepository: ICourseLessonVideoRepository;

  public async updateVideo(
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    try {
      const updatedVideo = await this.courseLessonVideoRepository.updateVideo(
        params,
        videoDetails
      );

      return getValuable(updatedVideo);
    } catch (error) {
      throw error;
    }
  }

  public async deleteVideo(
    params: CourseLessonVideoParams
  ): Promise<CourseLessonVideoModel> {
    try {
      const deletedVideo = await this.courseLessonVideoRepository.deleteVideo(
        params
      );

      return getValuable(deletedVideo);
    } catch (error) {
      throw error;
    }
  }

  public async createVideo(
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    try {
      const video = await this.courseLessonVideoRepository.createVideo(
        params,
        videoDetails
      );

      return getValuable(video);
    } catch (error) {
      throw error;
    }
  }
}
