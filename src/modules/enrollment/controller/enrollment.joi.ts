import Joi from "joi";
import { CourseEnrollmentRoleModel } from "../../course/course.type";
import { $CourseEnrollmentAPI } from "../enrollment.api";

export const CreateCourseEnrollmentDtoJoi =
  Joi.object<$CourseEnrollmentAPI.CreateEnrollment.Dto>({
    userId: Joi.number().required(),
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
  Joi.object<$CourseEnrollmentAPI.UpdateEnrollment.Dto>({
    role: Joi.string()
      .required()
      .valid(
        ...[
          CourseEnrollmentRoleModel.STUDENT,
          CourseEnrollmentRoleModel.INSTRUCTOR,
        ].map((enrollmentRole) => enrollmentRole.toString()),
      ),
  });
