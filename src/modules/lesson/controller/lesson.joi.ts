import Joi from "joi";
import { CreateCourseLessonDto } from "../lesson.type";
import { UpdateCourseDto } from "../../course/course.type";

export const CreateCourseLesson = Joi.object<CreateCourseLessonDto>({
  title: Joi.string().required(),
  description: Joi.string(),
});

export const UpdateCourseLesson = Joi.object<UpdateCourseDto>({
  title: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
  image: Joi.string(),
});
