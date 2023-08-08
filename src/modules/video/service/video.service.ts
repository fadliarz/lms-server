import { injectable, inject } from "inversify";
import { ICourseLessonVideoRepository } from "../repository/video.repository";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoModel,
  CreateCourseLessonVideoDto,
  CourseLessonVideoParams,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import { doMinimumRoleAuthorization } from "../../../common/functions/doMinimumRoleAuthorization";
import { CourseLessonVideo, Role } from "@prisma/client";
import { getValuable } from "../../../common/functions/getValuable";
import { AuthorizationException } from "../../../common/exceptions/AuthorizationException";

export interface ICourseLessonVideoService {
  updateVideo: (
    userId: string,
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (
    userId: string,
    params: CourseLessonVideoParams
  ) => Promise<CourseLessonVideoModel>;
  createVideo: (
    userId: string,
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideoModel>;
}

@injectable()
export class CourseLessonVideoService implements ICourseLessonVideoService {
  @inject(CourseLessonVideoDITypes.COURSE_LESSON_VIDEO_REPOSITORY)
  courseLessonVideoRepository: ICourseLessonVideoRepository;

  private async isOwnerOfCourseOrThrow(
    userId: string,
    courseId: string
  ): Promise<void> {
    try {
      const isOwner = await this.courseLessonVideoRepository.isOwnerOfCourse(
        userId,
        courseId
      );

      if (!isOwner) {
        throw new AuthorizationException(
          "Unathorized! You're not the author of the course"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  private async authorizeUserOrThrow(
    userId: string,
    courseId: string,
    minimumRole: Role
  ): Promise<void> {
    try {
      const userRole =
        await this.courseLessonVideoRepository.getUserEnrollmentRoleInCourse(
          userId,
          courseId
        );

      doMinimumRoleAuthorization(userRole, minimumRole);
    } catch (error) {}
  }

  public async updateVideo(
    userId: string,
    params: CourseLessonVideoParams,
    videoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    try {
      await this.authorizeUserOrThrow(userId, params.courseId, Role.INSTRUCTOR);

      const updatedVideo = await this.courseLessonVideoRepository.deleteVideo(
        params
      );

      return getValuable(updatedVideo);
    } catch (error) {
      throw error;
    }
  }

  public async deleteVideo(
    userId: string,
    params: CourseLessonVideoParams
  ): Promise<CourseLessonVideoModel> {
    try {
      await this.authorizeUserOrThrow(userId, params.courseId, Role.INSTRUCTOR);

      const deletedVideo = await this.courseLessonVideoRepository.deleteVideo(
        params
      );

      return getValuable(deletedVideo);
    } catch (error) {
      throw error;
    }
  }

  public async createVideo(
    userId: string,
    params: CourseLessonVideoParams,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideoModel> {
    try {
      await this.authorizeUserOrThrow(userId, params.courseId, Role.INSTRUCTOR);

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
