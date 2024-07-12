import { StatusCode } from "../../constants/statusCode";
import { ErrorCode } from "../../constants/errorCode";
import { ErrorMessage } from "../../constants/errorMessage";
import HttpException from "./HttpException";

export default class InternalServerException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
      message || (ErrorMessage[ErrorCode.INTERNAL_SERVER_ERROR] as string),
      true,
    );
  }
}
