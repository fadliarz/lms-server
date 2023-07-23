class HttpException extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly customMessage: string | string[]
  ) {
    super();
  }
}

export default HttpException;
