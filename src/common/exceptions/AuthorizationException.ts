import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export class AuthorizationException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.UNAUTHORIZED, message ? message : "Unauthorized!");
  }
}
