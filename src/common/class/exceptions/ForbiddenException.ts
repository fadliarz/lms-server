import HttpException from "./HttpException";
import { StatusCode } from "../../constants/statusCode";
import { ErrorCode } from "../../constants/errorCode";
import { ErrorMessage } from "../../constants/errorMessage";

export default class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.FORBIDDEN,
      ErrorCode.FORBIDDEN,
      message || (ErrorMessage[ErrorCode.UNAUTHENTICATED] as string),
      true,
    );
  }
}
