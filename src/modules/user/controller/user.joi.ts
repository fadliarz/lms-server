import Joi from "joi";
import { SignInDto, SignUpDto } from "../user.type";

const SignUp = Joi.object<SignUpDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const SignIn = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { SignUp, SignIn };
