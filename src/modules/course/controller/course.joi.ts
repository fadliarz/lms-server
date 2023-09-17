import Joi from "joi";
import {
  CreateCourseDto,
  CreateCourseLikeDto,
  GetCourseQuery,
  GetCoursesQuery,
  UpdateCourseDto,
} from "../course.type";

export const CreateCourseDtoJoi = Joi.object<CreateCourseDto>({
  image: Joi.string(),
  categoryId: Joi.number().required(),
  title: Joi.string().required(),
  description: Joi.string(),
  material: Joi.string(),
});
export const UpdateCourseDtoJoi = Joi.object<UpdateCourseDto>({
  image: Joi.string(),
  categoryId: Joi.number(),
  title: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
});
export const CreateCourseLikeDtoJoi = Joi.object<CreateCourseLikeDto>({
  courseId: Joi.number().required(),
});

export const GetCourseQueryJoi = Joi.object<GetCourseQuery>({
  include_students: Joi.string().valid("true", "false").insensitive(),
  include_instructors: Joi.string().valid("true", "false").insensitive(),
  include_lessons: Joi.string().valid("true", "false").insensitive(),
  include_videos: Joi.string().valid("true", "false").insensitive(),
  include_author: Joi.string().valid("true", "false").insensitive(),
});
export const GetCoursesQueryJoi = Joi.object<GetCoursesQuery>({
  include_student_courses: Joi.string().valid("true", "false").insensitive(),
  include_instructor_courses: Joi.string().valid("true", "false").insensitive(),
  include_owned_courses: Joi.string().valid("true", "false").insensitive(),
  category_id: Joi.string(),
}).or(
  "include_student_courses",
  "include_instructor_courses",
  "include_owned_courses"
);
