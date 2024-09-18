import "reflect-metadata";
import { injectable } from "inversify";

import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

import BaseRepository from "../../../common/class/BaseRepository";
import getQueryExtendsObject from "../../../common/functions/getQueryExtendObject";
import { ICourseLessonAttachmentRepository } from "../attachment.interface";
import {
  CourseLessonAttachmentModel,
  CourseLessonAttachmentResourceId,
} from "../attachment.type";
import { $CourseLessonAttachmentAPI } from "../attachment.api";

@injectable()
export default class CourseLessonAttachmentRepository
  extends BaseRepository
  implements ICourseLessonAttachmentRepository
{
  constructor() {
    super();
  }

  public async createAttachment(
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonAttachmentResourceId, "lessonId">;
    },
    data: $CourseLessonAttachmentAPI.CreateAttachment.Dto,
  ): Promise<CourseLessonAttachmentModel> {
    const { lessonId, resourceId } = id;

    if (resourceId) {
      this.db.courseLesson.findFirst({
        where: {
          id: lessonId,
          course: {
            id: resourceId.courseId,
          },
        },
      });
    }

    return this.db.courseLessonAttachment.create({
      data: {
        ...data,
        lessonId,
      },
    });
  }

  public async getAttachments(
    id: {
      lessonId: number;
      resourceId?: Omit<CourseLessonAttachmentResourceId, "lessonId">;
    },
    query?: $CourseLessonAttachmentAPI.GetAttachments.Query,
  ): Promise<CourseLessonAttachmentModel[]> {
    return this.db.courseLessonAttachment.findMany({
      where: this.getWhereObjectForFirstLevelOperation(id),
      ...getQueryExtendsObject(query),
    });
  }

  public async getAttachmentById(id: {
    attachmentId: number;
    resourceId?: CourseLessonAttachmentResourceId;
  }): Promise<CourseLessonAttachmentModel | null> {
    return this.db.courseLessonAttachment.findFirst({
      where: this.getWhereObjectForSecondLevelOperation(id),
    });
  }

  public async getAttachmentByIdOrThrow(
    id: {
      attachmentId: number;
      resourceId?: CourseLessonAttachmentResourceId;
    },
    error?: Error,
  ): Promise<CourseLessonAttachmentModel> {
    const attachment = await this.getAttachmentById(id);

    if (!attachment) {
      throw error || new RecordNotFoundException();
    }

    return attachment;
  }

  public async updateAttachment(
    id: {
      attachmentId: number;
      resourceId: CourseLessonAttachmentResourceId;
    },
    data: Partial<CourseLessonAttachmentModel>,
  ) {
    return this.db.courseLessonAttachment.update({
      where: this.getWhereObjectForSecondLevelOperation(id),
      data,
    });
  }

  public async deleteAttachment(id: {
    attachmentId: number;
    resourceId: CourseLessonAttachmentResourceId;
  }): Promise<{ id: number }> {
    return this.db.courseLessonAttachment.delete({
      where: this.getWhereObjectForSecondLevelOperation(id),
      select: {
        id: true,
      },
    });
  }

  private getWhereObjectForFirstLevelOperation(id: {
    lessonId: number;
    resourceId?: Omit<CourseLessonAttachmentResourceId, "lessonId">;
  }):
    | {
        lesson: { id: number };
      }
    | {
        lesson: { id: number; course: { id: number } };
      } {
    if (id.resourceId) {
      return {
        lesson: {
          id: id.lessonId,
          course: {
            id: id.resourceId.courseId,
          },
        },
      };
    }

    return {
      lesson: { id: id.lessonId },
    };
  }

  private getWhereObjectForSecondLevelOperation(id: {
    attachmentId: number;
    resourceId?: CourseLessonAttachmentResourceId;
  }):
    | { id: number }
    | { id: number; lesson: { id: number; course: { id: number } } } {
    const { attachmentId, resourceId } = id;

    if (resourceId) {
      return {
        id: attachmentId,
        lesson: {
          id: resourceId.lessonId,
          course: { id: resourceId.courseId },
        },
      };
    }

    return { id: attachmentId };
  }
}
