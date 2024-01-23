import HttpException from "./HttpException";
import { StatusCode } from "../../constants/statusCode";
import { ErrorCode } from "../../constants/errorCode";
import { ErrorMessage } from "../../constants/errorMessage";

export default class RecordNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      StatusCode.NOT_FOUND,
      ErrorCode.RESOURCE_NOT_FOUND,
      message || (ErrorMessage[ErrorCode.RESOURCE_NOT_FOUND] as string),
      true
    );
  }
}
