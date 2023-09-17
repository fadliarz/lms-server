export default class HttpException extends Error {
  public status: number;
  public message: string;
  public isOperational: boolean;

  constructor(
    status: number,
    customMessage: string | string[],
    isOperational = false
  ) {
    super(customMessage.toString());
    this.status = status;
    this.isOperational = isOperational;
  }
}
