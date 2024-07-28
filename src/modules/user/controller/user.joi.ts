import Joi from "joi";
import {
  CreateUserDto,
  SignInDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserPhoneNumberDto,
} from "../user.type";

export const CreateUserDtoJoi = Joi.object<CreateUserDto>({
  /**
   * Required
   *
   */
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  NIM: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().required(),
  bloodType: Joi.string().required(),
  medicalHistories: Joi.array().items(Joi.string()).required(),
  HMM: Joi.array().items(Joi.string()).required(),
  UKM: Joi.array().items(Joi.string()).required(),
  hobbies: Joi.array().items(Joi.string()).required(),
  lineId: Joi.string().required(),
  emergencyNumber: Joi.string().required(),
  /**
   * Optional
   *
   */
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  about: Joi.string(),
});

export const UpdateBasicUserDtoJoi = Joi.object<CreateUserDto>({
  name: Joi.string(),
  NIM: Joi.string(),
  dateOfBirth: Joi.date(),
  address: Joi.string(),
  bloodType: Joi.string(),
  medicalHistories: Joi.array().items(Joi.string()),
  HMM: Joi.array().items(Joi.string()),
  UKM: Joi.array().items(Joi.string()),
  hobbies: Joi.array().items(Joi.string()),
  lineId: Joi.string(),
  emergencyNumber: Joi.string(),
  avatar: Joi.string(),
  about: Joi.string(),
});

export const UpdateUserEmailDtoJoi = Joi.object<UpdateUserEmailDto>({
  email: Joi.string().email().required(),
});

export const UpdateUserPasswordDtoJoi = Joi.object<UpdateUserPasswordDto>({
  password: Joi.string().required(),
});

export const UpdateUserPhoneNumberDtoJoi = Joi.object<UpdateUserPhoneNumberDto>(
  {
    phoneNumber: Joi.string().required(),
  },
);

export const SignIn = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
