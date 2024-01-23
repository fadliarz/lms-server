import Joi from "joi";
import {
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentRoleDto,
} from "../enrollment.type";
import { CourseEnrollmentRoleModel } from "../../course/course.type";

export const CreateCourseEnrollmentDtoJoi =
  Joi.object<CreateCourseEnrollmentDto>({
    userId: Joi.number().required(),
    courseId: Joi.number().required(),
    role: Joi.string()
      .required()
      .valid(
        ...[
          CourseEnrollmentRoleModel.STUDENT,
          CourseEnrollmentRoleModel.INSTRUCTOR,
        ].map((enrollmentRole) => enrollmentRole.toString()),
      ),
  });
export const UpdateCourseEnrollmentRoleDtoJoi =
  Joi.object<UpdateCourseEnrollmentRoleDto>({
    role: Joi.string()
      .required()
      .valid(
        ...[
          CourseEnrollmentRoleModel.STUDENT,
          CourseEnrollmentRoleModel.INSTRUCTOR,
        ].map((enrollmentRole) => enrollmentRole.toString()),
      ),
  });
