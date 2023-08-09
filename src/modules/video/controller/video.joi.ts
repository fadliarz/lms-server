import Joi from "joi";
import {
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
} from "../video.type";

export const CreateCourseLessonVideo = Joi.object<CreateCourseLessonVideoDto>({
  name: Joi.string().required(),
  description: Joi.string(),
  totalDurations: Joi.number().required(),
  youtubeLink: Joi.string().required(),
});

export const UpdateCourseLessonVideo = Joi.object<UpdateCourseLessonVideoDto>({
  name: Joi.string(),
  description: Joi.string(),
  totalDurations: Joi.number(),
  youtubeLink: Joi.string(),
});
