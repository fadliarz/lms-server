import { inject, injectable } from "inversify";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import { UserModel } from "../../user/user.type";
import {
  ICourseLessonAttachmentAuthorization,
  ICourseLessonAttachmentRepository,
  ICourseLessonAttachmentService,
} from "../attachment.interface";
import {
  CourseLessonAttachmentDITypes,
  CourseLessonAttachmentResourceId,
} from "../attachment.type";
import { $CourseLessonAttachmentAPI } from "../attachment.api";

@injectable()
export default class CourseLessonAttachmentService
  implements ICourseLessonAttachmentService
{
  @inject(CourseLessonAttachmentDITypes.REPOSITORY)
  repository: ICourseLessonAttachmentRepository;

  @inject(CourseLessonAttachmentDITypes.AUTHORIZATION)
  authorization: ICourseLessonAttachmentAuthorization;

  public async createAttachment(
    user: UserModel,
    id: {
      resourceId: CourseLessonAttachmentResourceId;
    },
    dto: $CourseLessonAttachmentAPI.CreateAttachment.Dto,
  ): Promise<$CourseLessonAttachmentAPI.CreateAttachment.Response["data"]> {
    try {
      await this.authorization.authorizeCreateAttachment(
        user,
        id.resourceId.courseId,
      );

      const { lessonId, ...theResourceId } = id.resourceId;

      return await this.repository.createAttachment(
        { lessonId, resourceId: theResourceId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getAttachments(
    user: UserModel,
    id: {
      resourceId: CourseLessonAttachmentResourceId;
    },
    query: $CourseLessonAttachmentAPI.GetAttachments.Query,
  ): Promise<$CourseLessonAttachmentAPI.GetAttachments.Response["data"]> {
    try {
      await this.authorization.authorizeReadAttachment(
        user,
        id.resourceId.courseId,
      );

      const { lessonId, ...theResourceId } = id.resourceId;

      return await this.repository.getAttachments(
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

  public async getAttachmentById(
    user: UserModel,
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
  ): Promise<$CourseLessonAttachmentAPI.GetAttachmentById.Response["data"]> {
    try {
      await this.authorization.authorizeReadAttachment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.getAttachmentByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateAttachment(
    user: UserModel,
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
    dto: $CourseLessonAttachmentAPI.UpdateAttachment.Dto,
  ): Promise<$CourseLessonAttachmentAPI.UpdateAttachment.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateAttachment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.updateAttachment(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteAttachment(
    user: UserModel,
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
  ): Promise<$CourseLessonAttachmentAPI.DeleteAttachment.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteAttachment(
        user,
        id.resourceId.courseId,
      );

      return await this.repository.deleteAttachment(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
