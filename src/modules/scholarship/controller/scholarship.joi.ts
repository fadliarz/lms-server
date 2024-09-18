import Joi from "joi";
import { $ScholarshipAPI } from "../scholarship.api";
import { ScholarshipFundingModel } from "../../../common/shared.types";

export const CreateScholarshipDtoJoi =
  Joi.object<$ScholarshipAPI.CreateScholarship.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    provider: Joi.string().required(),
    deadline: Joi.date().required(),
    reference: Joi.string().required(),
    funding: Joi.valid(...Object.values(ScholarshipFundingModel)).required(),
    scope: Joi.string().required(),
  });

export const UpdateScholarshipDtoJoi =
  Joi.object<$ScholarshipAPI.UpdateScholarship.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    provider: Joi.string(),
    deadline: Joi.date(),
    reference: Joi.string(),
    funding: Joi.valid(...Object.values(ScholarshipFundingModel)),
    scope: Joi.string(),
  });
