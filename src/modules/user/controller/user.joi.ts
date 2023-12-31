import Joi from "joi";
import { SignInDto, SignUpDto } from "../user.type";

const SignUp = Joi.object<SignUpDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
  NIM: Joi.string().required(),
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  about: Joi.string(),
});
const SignIn = Joi.object<SignInDto>({
  email: Joi.string().email(),
  password: Joi.string(),
});

export { SignUp, SignIn };
