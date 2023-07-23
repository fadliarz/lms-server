import { StatusCode } from "../../common/constants/statusCode";
import HttpException from "./HttpException";

export class InternalServerException extends HttpException {
  constructor() {
    super(StatusCode.SERVER_ERROR, "Internal server error, try again later!");
  }
}
