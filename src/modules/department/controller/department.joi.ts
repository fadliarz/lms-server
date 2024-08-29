import Joi from "joi";
import { $DepartmentAPI } from "../department.api";

export const CreateDepartmentDtoJoi =
  Joi.object<$DepartmentAPI.CreateDepartment.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
  });

export const UpdateDepartmentDtoJoi =
  Joi.object<$DepartmentAPI.UpdateDepartment.Dto>({
    title: Joi.string(),
    description: Joi.string(),
  });

export const UpdateDepartmentLeaderIdDtoJoi =
  Joi.object<$DepartmentAPI.UpdateDepartmentLeaderId.Dto>({
    leaderId: Joi.number().required(),
  });

export const UpdateDepartmentCoLeaderIdDtoJoi =
  Joi.object<$DepartmentAPI.UpdateDepartmentCoLeaderId.Dto>({
    coLeaderId: Joi.number().required(),
  });
