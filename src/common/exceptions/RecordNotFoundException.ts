import HttpException from "./HttpException";
import { StatusCode } from "../../common/constants/statusCode";

export class RecordNotFoundException extends HttpException {
  constructor() {
    super(StatusCode.NOT_FOUND, "Record not found!");
  }
}
