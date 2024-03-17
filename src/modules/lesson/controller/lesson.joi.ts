import Joi from "joi";
import {
  CreateCourseLessonDto,
  UpdateBasicCourseLessonDto,
} from "../lesson.type";

/**
 * Create
 *
 */
export const CreateCourseLessonDtoJoi = Joi.object<CreateCourseLessonDto>({
  title: Joi.string().required(),
  description: Joi.string(),
});

/**
 * Update
 *
 */
export const UpdateBasicCourseLessonDtoJoi =
  Joi.object<UpdateBasicCourseLessonDto>({
    title: Joi.string(),
    description: Joi.string(),
  });
