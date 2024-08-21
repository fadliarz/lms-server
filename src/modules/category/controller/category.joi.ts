import Joi from "joi";
import { $CourseCategoryAPI } from "../category.type";

export const CreateCourseCategoryDtoJoi =
  Joi.object<$CourseCategoryAPI.CreateCategory.Dto>({
    title: Joi.string().required(),
  });

export const UpdateCourseCategoryDtoJoi =
  Joi.object<$CourseCategoryAPI.UpdateCategory.Dto>({
    title: Joi.string(),
  });
