import Joi from "joi";
import { $DepartmentDivisionEnrollmentAPI } from "../enrollment.api";

export const CreateDepartmentDivisionEnrollmentDtoJoi =
  Joi.object<$DepartmentDivisionEnrollmentAPI.CreateEnrollment.Dto>({
    userId: Joi.number().required(),
  });
