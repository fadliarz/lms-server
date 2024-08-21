import Joi from "joi";
import { $DepartmentDivisionEnrollmentAPI } from "../enrollment.type";

export const CreateDepartmentDivisionEnrollmentDtoJoi =
  Joi.object<$DepartmentDivisionEnrollmentAPI.CreateEnrollment.Dto>({
    userId: Joi.number().required(),
  });
