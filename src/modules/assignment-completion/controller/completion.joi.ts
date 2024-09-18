import Joi from "joi";
import { $CourseClassAssignmentCompletionAPI } from "../completion.api";
import { AssignmentCompletionStatusModel } from "../../../common/shared.types";

export const CreateCourseAssignmentCompletionDtoJoi =
  Joi.object<$CourseClassAssignmentCompletionAPI.CreateCompletion.Dto>({
    userId: Joi.number().required(),
    completionStatus: Joi.valid(
      ...Object.values(AssignmentCompletionStatusModel),
    ).required(),
  });

export const UpdateCourseAssignmentCompletionDtoJoi =
  Joi.object<$CourseClassAssignmentCompletionAPI.UpdateCompletion.Dto>({
    completionStatus: Joi.valid(
      ...Object.values(AssignmentCompletionStatusModel),
    ).required(),
  });
