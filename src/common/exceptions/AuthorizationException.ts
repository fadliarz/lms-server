import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export class AuthorizationException extends HttpException {
  constructor() {
    super(StatusCode.UNAUTHORIZED, "Unauthorized!");
  }
}
