import { StatusCode } from "../constants/statusCode";
import HttpException from "./HttpException";

export default class ClientException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.BAD_REQUEST, message || "Client side error!", true);
  }
}
