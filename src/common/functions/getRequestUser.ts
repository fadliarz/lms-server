import { StatusCode } from "../../common/constants/statusCode";
import HttpException from "../../common/exceptions/HttpException";
import { AuthenticatedRequest } from "../../common/types";
import { Request } from "express";
import { UserModel } from "../../modules/user/user.type";

export function getRequestUser(req: Request): UserModel {
  const authenticatedRequest = req as AuthenticatedRequest;

  if (!authenticatedRequest.user) {
    throw new HttpException(StatusCode.BAD_REQUEST, "Not authenticated!");
  }

  return authenticatedRequest.user;
}
