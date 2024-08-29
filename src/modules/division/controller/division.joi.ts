import Joi from "joi";
import { $DepartmentDivisionAPI } from "../division.api";

export const CreateDepartmentDivisionDtoJoi =
  Joi.object<$DepartmentDivisionAPI.CreateDivision.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    leaderId: Joi.number(),
    coLeaderId: Joi.number(),
  });

export const UpdateDepartmentDivisionDtoJoi =
  Joi.object<$DepartmentDivisionAPI.UpdateDivision.Dto>({
    title: Joi.string(),
    description: Joi.string(),
  });

export const UpdateDepartmentDivisionLeaderIdDtoJoi =
  Joi.object<$DepartmentDivisionAPI.UpdateDivisionLeaderId.Dto>({
    leaderId: Joi.number().required(),
  });

export const UpdateDepartmentDivisionCoLeaderIdDtoJoi =
  Joi.object<$DepartmentDivisionAPI.UpdateDivisionCoLeaderId.Dto>({
    coLeaderId: Joi.number().required(),
  });
