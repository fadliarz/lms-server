import Joi from "joi";
import { Role } from "@prisma/client";
import {
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
} from "../enrollment.type";

export const CreateCourseEnrollmentDtoJoi =
  Joi.object<CreateCourseEnrollmentDto>({
    userId: Joi.number().required(),
    courseId: Joi.number().required(),
    role: Joi.string()
      .required()
      .valid(...[Role.STUDENT, Role.INSTRUCTOR].map((role) => role.toString())),
  });
export const UpdateCourseEnrollmentDtoJoi =
  Joi.object<UpdateCourseEnrollmentDto>({
    role: Joi.string()
      .required()
      .valid(...[Role.STUDENT, Role.INSTRUCTOR].map((role) => role.toString())),
  });
