import Joi from "joi";
import { $CourseClassAssignmentAPI } from "../assignment.type";

/**
 * Create
 *
 */
export const CreateCourseClassAssignmentDtoJoi =
  Joi.object<$CourseClassAssignmentAPI.CreateAssignment.Dto>({
    title: Joi.string().required(),
    submission: Joi.string().required(),
    deadline: Joi.date().required(),
  });

/**
 * Update
 *
 */
export const UpdateCourseClassAssignmentDtoJoi =
  Joi.object<$CourseClassAssignmentAPI.UpdateAssignment.Dto>({
    title: Joi.string(),
    submission: Joi.string(),
    deadline: Joi.date(),
  });
