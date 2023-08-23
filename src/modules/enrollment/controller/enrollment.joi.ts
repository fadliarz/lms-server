import Joi from "joi";
import { Role } from "@prisma/client";
import { CreateCourseEnrollmentDto } from "../enrollment.type";

export const CreateCourseEnrollmentDtoJoi =
  Joi.object<CreateCourseEnrollmentDto>({
    userId: Joi.number().required(),
    role: Joi.string()
      .required()
      .valid(...[Role.STUDENT, Role.INSTRUCTOR].map((role) => role.toString())),
  });

export const UpdateCousreEnrollmentDtoJoi = CreateCourseEnrollmentDtoJoi;
