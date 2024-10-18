import Joi from "joi";
import { $PersonalAssignmentAPI } from "../assignment.api";
import {
  AssignmentCompletionStatusModel,
  AssignmentTaskTypeModel,
} from "../../../common/shared.types";

export const CreatePersonalAssignmentDtoJoi =
  Joi.object<$PersonalAssignmentAPI.CreateAssignment.Dto>({
    title: Joi.string().required(),
    course: Joi.string().required(),
    submission: Joi.string().required(),
    deadline: Joi.date().required(),
    description: Joi.string(),
    taskType: Joi.valid(...Object.values(AssignmentTaskTypeModel)).required(),
    completionStatus: Joi.valid(
      ...Object.values(AssignmentCompletionStatusModel),
    ).required(),
  });

export const UpdatePersonalAssignmentDtoJoi =
  Joi.object<$PersonalAssignmentAPI.UpdateAssignment.Dto>({
    title: Joi.string(),
    course: Joi.string().required(),
    submission: Joi.string(),
    deadline: Joi.date(),
    description: Joi.string(),
    taskType: Joi.valid(...Object.values(AssignmentTaskTypeModel)),
    completionStatus: Joi.valid(...Object.values(AssignmentTaskTypeModel)),
  });
