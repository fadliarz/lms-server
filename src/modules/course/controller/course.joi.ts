import Joi from "joi";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";

const CreateCourse = Joi.object<CreateCourseDto>({
  image: Joi.string(),
  title: Joi.string().required(),
  description: Joi.string(),
});

const UpdateCourse = Joi.object<UpdateCourseDto>({
  image: Joi.string(),
  title: Joi.string(),
  description: Joi.string(),
});

export { CreateCourse, UpdateCourse };
