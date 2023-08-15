import { AuthenticatedRequest } from "../types";
import { Request } from "express";
import { UserModel } from "../../modules/user/user.type";
import { AuthenticationException } from "../exceptions/AuthenticationException";

export function getRequestUserOrThrowAuthenticationException(
  req: Request
): UserModel {
  const authenticatedRequest = req as AuthenticatedRequest;

  if (!authenticatedRequest.user) {
    throw new AuthenticationException();
  }

  return authenticatedRequest.user;
}
