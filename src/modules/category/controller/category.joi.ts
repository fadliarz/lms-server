import Joi from "joi";
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
} from "../category.type";

/**
 * CreateCourseCategory
 *
 */
export const CreateCourseCategoryDtoJoi = Joi.object<CreateCourseCategoryDto>({
  title: Joi.string().required(),
});

/**
 * UpdateCourseCategory
 *
 */
export const UpdateCourseCategoryDtoJoi = Joi.object<UpdateCourseCategoryDto>({
  title: Joi.string(),
});
