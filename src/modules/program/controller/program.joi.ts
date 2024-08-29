import Joi from "joi";
import { $DepartmentProgramAPI } from "../program.api";

export const CreateDepartmentProgramDtoJoi =
  Joi.object<$DepartmentProgramAPI.CreateProgram.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    date: Joi.date().required(),
  });

export const UpdateDepartmentProgramDtoJoi =
  Joi.object<$DepartmentProgramAPI.UpdateProgram.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    date: Joi.date(),
  });
