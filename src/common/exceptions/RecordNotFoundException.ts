import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export class RecordNotFoundException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.NOT_FOUND, message || "Record not found!");
  }
}
