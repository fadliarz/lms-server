import { inject, injectable } from "inversify";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoResourceId,
} from "../video.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  ICourseLessonVideoAuthorization,
  ICourseLessonVideoRepository,
  ICourseLessonVideoService,
} from "../video.interface";
import { UserModel } from "../../user/user.type";
import { $CourseLessonVideoAPI } from "../video.api";

@injectable()
export default class CourseLessonVideoService
  implements ICourseLessonVideoService
{
  @inject(CourseLessonVideoDITypes.REPOSITORY)
  repository: ICourseLessonVideoRepository;

  @inject(CourseLessonVideoDITypes.AUTHORIZATION)
  authorization: ICourseLessonVideoAuthorization;

  public async createVideo(
    user: UserModel,
    id: {
      resourceId: CourseLessonVideoResourceId;
    },
    dto: $CourseLessonVideoAPI.CreateVideo.Dto,
  ): Promise<$CourseLessonVideoAPI.CreateVideo.Response["data"]> {
    try {
      await this.authorization.authorizeCreateVideo(
        user,
        id.resourceId.courseId,
      );

      const { lessonId, ...theResourceId } = id.resourceId;

      return await this.repository.createVideo(
        { lessonId, resourceId: theResourceId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getVideos(
    user: UserModel,
    id: {
      resourceId: CourseLessonVideoResourceId;
    },
    query: $CourseLessonVideoAPI.GetVideos.Query,
  ): Promise<$CourseLessonVideoAPI.GetVideos.Response["data"]> {
    try {
      await this.authorization.authorizeReadVideo(user, id.resourceId.courseId);

      const { lessonId, ...theResourceId } = id.resourceId;

      return await this.repository.getVideos(
        {
          lessonId,
          resourceId: theResourceId,
        },
        query,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getVideoById(
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
  ): Promise<$CourseLessonVideoAPI.GetVideoById.Response["data"]> {
    try {
      await this.authorization.authorizeReadVideo(user, id.resourceId.courseId);

      return await this.repository.getVideoByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateVideo(
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    dto: $CourseLessonVideoAPI.UpdateVideo.Dto,
  ): Promise<$CourseLessonVideoAPI.UpdateVideo.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateVideo(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.updateVideo(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteVideo(
    user: UserModel,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
  ): Promise<$CourseLessonVideoAPI.DeleteVideo.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteVideo(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.deleteVideo(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
