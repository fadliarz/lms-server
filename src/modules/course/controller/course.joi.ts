import Joi from "joi";
import {
  CreateCourseDto,
  GetAllCoursesQuery,
  GetOneCourseQuery,
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

const GetAllCoursesQueryJoi = Joi.object<GetAllCoursesQuery>({
  role: Joi.string()
    .valid("OWNER", "INSTRUCTOR", "STUDENT")
    .insensitive()
    .required(),
  include_students: Joi.boolean(),
  include_instructors: Joi.boolean(),
});

const GetOneCourseQueryJoi = Joi.object<GetOneCourseQuery>({
  include_students: Joi.boolean(),
  include_instructors: Joi.boolean(),
});

export {
  CreateCourse,
  UpdateCourse,
  GetAllCoursesQueryJoi,
  GetOneCourseQueryJoi,
};
