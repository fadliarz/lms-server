import Joi from "joi";
import { CreateCourseLessonDto, UpdateCourseLessonDto } from "../lesson.type";

export const CreateCourseLessonDtoJoi = Joi.object<CreateCourseLessonDto>({
  title: Joi.string().required(),
  description: Joi.string(),
  courseId: Joi.number().required(),
});
export const UpdateCourseLessonDtoJoi = Joi.object<UpdateCourseLessonDto>({
  title: Joi.string(),
  description: Joi.string(),
});
