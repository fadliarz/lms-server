import Joi from "joi";
import { CreateCourseLessonDto, UpdateCourseLessonDto } from "../lesson.type";

/**
 * CreateCourseLesson
 *
 */
export const CreateCourseLessonDtoJoi = Joi.object<CreateCourseLessonDto>({
  title: Joi.string().required(),
  description: Joi.string(),
});

/**
 * UpdateCourseLesson
 *
 */
export const UpdateCourseLessonDtoJoi = Joi.object<UpdateCourseLessonDto>({
  title: Joi.string(),
  description: Joi.string(),
});
