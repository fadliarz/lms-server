import Joi from "joi";
import { $CourseLessonAPI } from "../lesson.api";

export const CreateCourseLessonDtoJoi =
  Joi.object<$CourseLessonAPI.CreateLesson.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    references: Joi.array().items(Joi.string()),
  });

export const GetCourseLessonsQueryDtoJoi =
  Joi.object<$CourseLessonAPI.GetLessons.Query>({
    pageNumber: Joi.number(),
    pageSize: Joi.number(),
  });

export const UpdateBasicCourseLessonDtoJoi =
  Joi.object<$CourseLessonAPI.UpdateLesson.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    references: Joi.array().items(Joi.string()),
  });
