import Joi from "joi";
import { $CourseClassAssignmentCompletionAPI } from "../completion.api";

export const CreateCourseAssignmentCompletionDtoJoi =
  Joi.object<$CourseClassAssignmentCompletionAPI.CreateCompletion.Dto>({
    userId: Joi.number().required(),
  });
