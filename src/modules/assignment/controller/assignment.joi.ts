import Joi from "joi";
import { $CourseClassAssignmentAPI } from "../assignment.api";

export const CreateCourseClassAssignmentDtoJoi =
  Joi.object<$CourseClassAssignmentAPI.CreateAssignment.Dto>({
    title: Joi.string().required(),
    submission: Joi.string().required(),
    deadline: Joi.date().required(),
  });

export const GetCourseClassAssignmentsQueryJoi =
  Joi.object<$CourseClassAssignmentAPI.GetAssignments.Query>({
    pageSize: Joi.number(),
    pageNumber: Joi.number(),
  });

export const UpdateCourseClassAssignmentDtoJoi =
  Joi.object<$CourseClassAssignmentAPI.UpdateAssignment.Dto>({
    title: Joi.string(),
    submission: Joi.string(),
    deadline: Joi.date(),
  });
