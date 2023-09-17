import { StatusCode } from "../../common/constants/statusCode";
import HttpException from "./HttpException";

export default class InternalServerException extends HttpException {
  constructor() {
    super(StatusCode.SERVER_ERROR, "Internal server error, try again later!", true);
  }
}
