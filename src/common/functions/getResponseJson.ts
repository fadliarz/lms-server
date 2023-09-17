export function getResponseJson(
  success: boolean,
  statusCode: number,
  data: any,
  message?: string | string[]
) {
  const responseJson = {
    success,
    status: statusCode,
    message: message ? message : "Request success!",
  };

  return {
    ...responseJson,
    data,
  };
}
