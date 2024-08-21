import Joi from "joi";
import { $ScholarshipAPI } from "../scholarship.type";

export const CreateScholarshipDtoJoi =
  Joi.object<$ScholarshipAPI.CreateScholarship.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    provider: Joi.string().required(),
    deadline: Joi.date().required(),
    reference: Joi.string().required(),
  });

export const UpdateScholarshipDtoJoi =
  Joi.object<$ScholarshipAPI.UpdateScholarship.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    provider: Joi.string(),
    deadline: Joi.date(),
    reference: Joi.string(),
  });
