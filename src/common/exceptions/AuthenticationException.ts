import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export class AuthenticationException extends HttpException {
  constructor() {
    super(StatusCode.UNAUTHENTICATED, "Unathenticated!");
  }
}
