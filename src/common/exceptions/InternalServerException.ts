import { StatusCode } from "../../common/constants/statusCode";
import { ErrorCode } from "../constants/errorCode";
import { ErrorMessage } from "../constants/errorMessage";
import HttpException from "./HttpException";

export default class InternalServerException extends HttpException {
  constructor() {
    super(
      StatusCode.SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR,
      ErrorMessage[ErrorCode.INTERNAL_SERVER_ERROR] as string,
      true
    );
  }
}
