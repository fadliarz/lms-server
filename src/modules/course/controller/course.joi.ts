import Joi from "joi";
import {
  CreateCourseDto,
  GetCourseQuery,
  GetCoursesQuery,
  UpdateCourseDto,
} from "../course.type";

const CreateCourseDtoJoi = Joi.object<CreateCourseDto>({
  image: Joi.string(),
  title: Joi.string().required(),
  description: Joi.string(),
  material: Joi.string(),
});

const UpdateCourseDtoJoi = Joi.object<UpdateCourseDto>({
  image: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
});

const GetCourseQueryJoi = Joi.object<GetCourseQuery>({
  include_students: Joi.string().valid("true", "false").insensitive(),
  include_instructors: Joi.string().valid("true", false).insensitive(),
  include_lessons: Joi.string().valid("true", "false").insensitive(),
  include_videos: Joi.string().valid("true", "false").insensitive(),
  include_author: Joi.string().valid("true", "false").insensitive(),
});

const GetCoursesQueryJoi = Joi.object<GetCoursesQuery>({
  include_student_course: Joi.string().valid("true", "false").insensitive(),
  include_instructor_course: Joi.string().valid("true", "false").insensitive(),
  include_owned: Joi.string().valid("true", "false").insensitive(),
}).or("include_student_course", "include_instructor_course", "include_owned");

export {
  CreateCourseDtoJoi,
  UpdateCourseDtoJoi,
  GetCourseQueryJoi,
  GetCoursesQueryJoi,
};
