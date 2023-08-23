export default class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, customMessage: string | string[]) {
    super(customMessage.toString());
    this.status = status;
  }
}
