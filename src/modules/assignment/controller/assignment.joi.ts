import Joi from "joi";
import { CreateCourseClassAssignmentDto, UpdateCourseClassAssignmentDto } from "../assignment.type";

/**
 * Create
 *
 */
export const CreateCourseClassAssignmentDtoJoi =
  Joi.object<CreateCourseClassAssignmentDto>({
    title: Joi.string().required(),
    submission: Joi.string().required(),
    deadline: Joi.date().required(),
  });

/**
 * Update
 *
 */
export const UpdateCourseClassAssignmentDtoJoi =
  Joi.object<UpdateCourseClassAssignmentDto>({
    title: Joi.string(),
    submission: Joi.string(),
    deadline: Joi.date(),
  });
