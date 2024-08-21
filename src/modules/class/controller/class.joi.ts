import Joi from "joi";
import { $CourseClassAPI } from "../class.type";

export const CreateCourseClassDtoJoi =
  Joi.object<$CourseClassAPI.CreateClass.Dto>({
    title: Joi.string().required(),
  });

export const UpdateCourseClassDtoJoi =
  Joi.object<$CourseClassAPI.UpdateClass.Dto>({
    title: Joi.string(),
  });
