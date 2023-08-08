import Joi from "joi";
import {
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
} from "../video.type";

export const CreateCourseLessonVideo = Joi.object<CreateCourseLessonVideoDto>({
  name: Joi.string().required(),
  description: Joi.string(),
  youtubeLink: Joi.string().required(),
});

export const UpdateCourseLessonVideo = Joi.object<UpdateCourseLessonVideoDto>({
  name: Joi.string(),
  description: Joi.string(),
  youtubeLink: Joi.string(),
});
