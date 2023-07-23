import Joi from "joi";
import { CreateCourseDto } from "../course.type";

const CreateCourse = Joi.object<CreateCourseDto>({
  image: Joi.string(),
  title: Joi.string().required(),
  description: Joi.string(),
});

export { CreateCourse };
