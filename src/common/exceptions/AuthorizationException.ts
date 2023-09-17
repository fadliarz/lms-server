import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export default class AuthorizationException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.UNAUTHORIZED, message ? message : "Unauthorized!", true);
  }
}
