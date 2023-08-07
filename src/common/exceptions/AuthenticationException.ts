import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export class AuthenticationException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.UNAUTHENTICATED, message ? message : "Unathenticated!");
  }
}
