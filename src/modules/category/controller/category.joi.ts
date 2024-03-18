import Joi from "joi";
import {
  CreateCourseCategoryDto,
  UpdateBasicCourseCategoryDto,
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
export const UpdateBasicCourseCategoryDtoJoi =
  Joi.object<UpdateBasicCourseCategoryDto>({
    title: Joi.string(),
  });
