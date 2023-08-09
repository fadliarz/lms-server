import Joi from "joi";
import {
  CreateCourseDto,
  GetCourseQuery,
  UpdateCourseDto,
} from "../course.type";

const CreateCourse = Joi.object<CreateCourseDto>({
  image: Joi.string(),
  title: Joi.string().required(),
  description: Joi.string(),
  material: Joi.string(),
});

const UpdateCourse = Joi.object<UpdateCourseDto>({
  image: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
});

const GetCourseQueryJoi = Joi.object<GetCourseQuery>({
  include_students: Joi.string().valid("true", "false").insensitive(),
  include_instructors: Joi.string().valid("true", false).insensitive(),
  include_lessons: Joi.string().valid("true", "false").insensitive(),
});

export { CreateCourse, UpdateCourse, GetCourseQueryJoi };
