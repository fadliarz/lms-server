import Joi from "joi";
import { $CourseEnrollmentAPI } from "../enrollment.type";
import { CourseEnrollmentRoleModel } from "../../course/course.type";

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
