import { PagingQuery } from "../../common/shared.types";
import { CourseLessonAttachmentModel } from "./attachment.type";

export namespace $CourseLessonAttachmentAPI {
  const root = "/courses/:courseId/lessons/:lessonId/attachments";
  const attachment = root + "/:attachmentId";

  export namespace CreateAttachment {
    export const endpoint = root;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}/attachments`;
    export type Dto = {
      name: string;
      description?: string;
      file: string;
    };
    export type Response = {
      data: CourseLessonAttachmentModel;
    };
  }

  export namespace GetAttachments {
    export const endpoint = root;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}/attachments`;
    export type Query = PagingQuery;
    export type Response = {
      data: CourseLessonAttachmentModel[];
    };
  }

  export namespace GetAttachmentById {
    export const endpoint = attachment;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      attachmentId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`;
    export type Response = {
      data: CourseLessonAttachmentModel;
    };
  }

  export namespace UpdateAttachment {
    export const endpoint = attachment;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      attachmentId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`;
    export type Dto = {
      name?: string;
      description?: string;
      file?: string;
    };
    export type Response = {
      data: CourseLessonAttachmentModel;
    };
  }

  export namespace DeleteAttachment {
    export const endpoint = attachment;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      attachmentId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
