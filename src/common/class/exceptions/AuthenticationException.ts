import HttpException from "./HttpException";
import { StatusCode } from "../../constants/statusCode";
import { ErrorCode } from "../../constants/errorCode";
import { ErrorMessage } from "../../constants/errorMessage";

export default class AuthenticationException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.UNAUTHENTICATED,
      ErrorCode.UNAUTHENTICATED,
      message || (ErrorMessage[ErrorCode.UNAUTHENTICATED] as string),
      true
    );
  }
}
