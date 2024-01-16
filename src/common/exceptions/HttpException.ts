import { ErrorCode } from "../constants/errorCode";
import { StatusCode } from "../constants/statusCode";

export default class HttpException extends Error {
  public status: StatusCode;
  public errorCode: ErrorCode;
  public message: string;
  public isOperational: boolean;

  constructor(
    status: StatusCode,
    errorCode: ErrorCode,
    customMessage: string | string[],
    isOperational = false
  ) {
    super(customMessage.toString());
    this.status = status;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
  }
}
