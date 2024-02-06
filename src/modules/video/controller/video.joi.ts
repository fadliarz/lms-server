import Joi from "joi";
import {
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";

export const CreateCourseLessonVideoJoi =
  Joi.object<CreateCourseLessonVideoDto>({
    name: Joi.string().required(),
    description: Joi.string(),
    totalDurations: Joi.number().required(),
    youtubeLink: Joi.string().required(),
  });
export const UpdateCourseLessonVideoSourceJoi =
  Joi.object<UpdateCourseLessonVideoSourceDto>({
    /**
     * Required Field
     *
     */
    youtubeLink: Joi.string().required(),
    totalDurations: Joi.number().required(),
    /**
     * Optional
     *
     */
    name: Joi.string(),
    description: Joi.string(),
  });
