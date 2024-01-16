import { StatusCode } from "../constants/statusCode";
import HttpException from "./HttpException";
import { ErrorCode } from "../constants/errorCode";
import { ErrorMessage } from "../constants/errorMessage";

export default class ClientException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.BAD_REQUEST,
      ErrorCode.BAD_REQUEST,
      message || (ErrorMessage[ErrorCode.BAD_REQUEST] as string),
      true
    );
  }
}
