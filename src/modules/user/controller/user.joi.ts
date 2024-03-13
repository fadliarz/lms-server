import Joi from "joi";
import {
  SignInDto,
  CreateUserDto,
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
  /**
   * Optional
   *
   */
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  about: Joi.string(),
});

export const UpdateBasicUserDtoJoi = Joi.object<CreateUserDto>({
  /**
   * Optional
   *
   */
  name: Joi.string(),
  NIM: Joi.string(),
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
