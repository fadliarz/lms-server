import Joi from "joi";
import { $DepartmentProgramEnrollmentAPI } from "../enrollment.api";

export const CreateDepartmentProgramEnrollmentDtoJoi =
  Joi.object<$DepartmentProgramEnrollmentAPI.CreateEnrollment.Dto>({
    userId: Joi.number().required(),
  });
