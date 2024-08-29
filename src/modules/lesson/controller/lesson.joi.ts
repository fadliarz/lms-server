import Joi from "joi";
import { $CourseLessonAPI } from "../lesson.api";

/**
 * Create
 *
 */
export const CreateCourseLessonDtoJoi =
  Joi.object<$CourseLessonAPI.CreateLesson.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
  });

/**
 * Update
 *
 */
export const UpdateBasicCourseLessonDtoJoi =
  Joi.object<$CourseLessonAPI.CreateLesson.Dto>({
    title: Joi.string(),
    description: Joi.string(),
  });
