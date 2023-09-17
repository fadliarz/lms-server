import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export default class RecordNotFoundException extends HttpException {
  constructor(message?: string) {
    super(StatusCode.NOT_FOUND, message || "Record not found!", true);
  }
}
