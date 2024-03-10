import Joi from "joi";
import { SignInDto, CreateUserDto } from "../user.type";

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

export const SignIn = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
