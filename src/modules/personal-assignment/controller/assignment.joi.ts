import Joi from "joi";
import { $PersonalAssignmentAPI } from "../assignment.type";

export const CreatePersonalAssignmentDtoJoi =
  Joi.object<$PersonalAssignmentAPI.CreateAssignment.Dto>({
    title: Joi.string().required(),
    submission: Joi.string().required(),
    deadline: Joi.date().required(),
  });

export const UpdatePersonalAssignmentDtoJoi =
  Joi.object<$PersonalAssignmentAPI.UpdateAssignment.Dto>({
    title: Joi.string(),
    submission: Joi.string(),
    deadline: Joi.date(),
    isDone: Joi.boolean().required(),
  });
