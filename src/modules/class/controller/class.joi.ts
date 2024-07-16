import { CreateCourseClassDto, UpdateCourseClassDto } from "../class.type";
import Joi from "joi";

/**
 * Create
 *
 */
export const CreateCourseClassDtoJoi = Joi.object<CreateCourseClassDto>({
  title: Joi.string().required(),
});

/**
 * Update
 *
 */
export const UpdateCourseClassDtoJoi = Joi.object<UpdateCourseClassDto>({
  title: Joi.string(),
});
