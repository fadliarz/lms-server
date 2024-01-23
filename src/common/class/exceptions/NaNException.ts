import HttpException from "./HttpException";
import { StatusCode } from "../../constants/statusCode";
import { ErrorCode } from "../../constants/errorCode";
import { ErrorMessage } from "../../constants/errorMessage";

export default class NaNException extends HttpException {
  constructor(params: string) {
    super(
      StatusCode.BAD_REQUEST,
      ErrorCode.INVALID_PARAMS,
      (ErrorMessage.NAN_PARAMS as (params: string) => string)(params),
      true,
    );
  }
}
