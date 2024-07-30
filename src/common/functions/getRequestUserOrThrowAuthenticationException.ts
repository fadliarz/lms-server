import { Request } from "express";
import { UserModel } from "../../modules/user/user.type";
import AuthenticationException from "../class/exceptions/AuthenticationException";
import { AuthenticatedRequest } from "../types";

export default function getRequestUserOrThrowAuthenticationException(
  req: Request,
): UserModel {
  const authenticatedRequest = req as AuthenticatedRequest;

  if (!authenticatedRequest.user) {
    throw new AuthenticationException();
  }

  return authenticatedRequest.user;
}
