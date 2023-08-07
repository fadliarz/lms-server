import Joi from "joi";
import {
  CreateCourseDto,
  GetCoursesQuery,
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

const GetCoursesQueryJoi = Joi.object<GetCoursesQuery>({
  role: Joi.string().valid("OWNER", "INSTRUCTOR", "STUDENT").insensitive().required(),
});

const GetCourseQueryJoi = Joi.object<GetCourseQuery>({
  include_students: Joi.string().valid("true", "false").insensitive(),
  include_instructors: Joi.string().valid("true", false).insensitive(),
  include_lessons: Joi.string().valid("true", "false").insensitive(),
});

export {
  CreateCourse,
  UpdateCourse,
  GetCoursesQueryJoi,
  GetCourseQueryJoi,
};
