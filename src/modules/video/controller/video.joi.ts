import Joi from "joi";
import {
  CreateCourseLessonVideoDto,
  UpdateBasicCourseLessonVideoDto,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";

export const CreateCourseLessonVideoJoi =
  Joi.object<CreateCourseLessonVideoDto>({
    name: Joi.string().required(),
    description: Joi.string(),
    totalDurations: Joi.number().required(),
    youtubeLink: Joi.string().required(),
  });

export const UpdateBasicCourseLessonVideoJoi =
  Joi.object<UpdateBasicCourseLessonVideoDto>({
    name: Joi.string(),
    description: Joi.string(),
  });
export const UpdateCourseLessonVideoSourceJoi =
  Joi.object<UpdateCourseLessonVideoSourceDto>({
    youtubeLink: Joi.string().required(),
    totalDurations: Joi.number().required(),
  });
