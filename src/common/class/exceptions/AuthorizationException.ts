import HttpException from "./HttpException";
import { StatusCode } from "../../constants/statusCode";
import { ErrorCode } from "../../constants/errorCode";
import { ErrorMessage } from "../../constants/errorMessage";

export default class AuthorizationException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.UNAUTHORIZED,
      ErrorCode.UNAUTHORIZED,
      message || (ErrorMessage[ErrorCode.UNAUTHORIZED] as string),
      true
    );
  }
}
