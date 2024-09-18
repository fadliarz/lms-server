import Joi from "joi";
import { $CourseLessonAttachmentAPI } from "../attachment.api";

export const CreateCourseLessonAttachmentDtoJoi =
  Joi.object<$CourseLessonAttachmentAPI.CreateAttachment.Dto>({
    name: Joi.string().required(),
    description: Joi.string(),
    file: Joi.string().required(),
  });

export const GetCourseLessonAttachmentsQueryJoi =
  Joi.object<$CourseLessonAttachmentAPI.GetAttachments.Query>({
    pageNumber: Joi.number(),
    pageSize: Joi.number(),
  });

export const UpdateCourseLessonAttachmentDtoJoi =
  Joi.object<$CourseLessonAttachmentAPI.UpdateAttachment.Dto>({
    name: Joi.string(),
    description: Joi.string(),
    file: Joi.string(),
  });
