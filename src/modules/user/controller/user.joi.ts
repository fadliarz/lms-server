import Joi from "joi";
import { $UserAPI } from "../user.api";
import getUserRoleArray from "../../../common/functions/getUserRoleArray";

export const CreateUserDtoJoi = Joi.object<$UserAPI.CreateUser.Dto>({
  /**
   * Required
   *
   */
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  name: Joi.string().required(),
  NIM: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().required(),
  bloodType: Joi.string().required(),
  medicalHistories: Joi.array().items(Joi.string()),
  UKM: Joi.array().items(Joi.string()),
  hobbies: Joi.array().items(Joi.string()),
  lineId: Joi.string().required(),
  emergencyNumber: Joi.string().required(),
  /**
   * Optional
   *
   */
  avatar: Joi.string(),
  about: Joi.string(),
});

export const GetPublicUsersQueryJoi = Joi.object<$UserAPI.GetPublicUsers.Query>(
  {
    pageSize: Joi.number(),
    pageNumber: Joi.number(),
  },
);

/**
 * User
 *
 */

export const GetUserEnrolledCoursesQueryJoi =
  Joi.object<$UserAPI.GetUserEnrolledCourses.Query>({
    category_id: Joi.array().items(Joi.number()),
    pageSize: Joi.number(),
    pageNumber: Joi.number(),
  });

export const GetUserManagedCoursesQueryJoi =
  Joi.object<$UserAPI.GetUserManagedCourses.Query>({
    category_id: Joi.array().items(Joi.number()),
    pageSize: Joi.number(),
    pageNumber: Joi.number(),
  });

export const UpdateBasicUserDtoJoi = Joi.object<$UserAPI.UpdateBasicUser.Dto>({
  phoneNumber: Joi.string(),
  name: Joi.string(),
  NIM: Joi.string(),
  avatar: Joi.string(),
  about: Joi.string(),
  dateOfBirth: Joi.date(),
  address: Joi.string(),
  bloodType: Joi.string(),
  medicalHistories: Joi.array().items(Joi.string()),
  UKM: Joi.array().items(Joi.string()),
  hobbies: Joi.array().items(Joi.string()),
  lineId: Joi.string(),
  emergencyNumber: Joi.string(),
});

export const UpdateUserEmailDtoJoi = Joi.object<$UserAPI.UpdateUserEmail.Dto>({
  email: Joi.string().email().required(),
});

export const UpdateUserPasswordDtoJoi =
  Joi.object<$UserAPI.UpdateUserPassword.Dto>({
    password: Joi.string().required(),
  });

export const UpdateUserRoleDtoJoi = Joi.object<$UserAPI.UpdateUserRole.Dto>({
  role: Joi.string()
    .valid(...getUserRoleArray().map((role) => role.toString()))
    .required(),
});

export const SignIn = Joi.object<$UserAPI.SignIn.Dto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
