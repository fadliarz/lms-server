import { ErrorCode } from "./errorCode";

type Key = ErrorCode | "NAN_PARAMS";

export const ErrorMessage: Record<Key, string | ((...arg: any) => string)> = {
  [ErrorCode.UNAUTHENTICATED]: "Unauthenticated, please login first!",
  [ErrorCode.UNAUTHORIZED]:
    "Unauthorized, you are not allowed to do this operation!",
  [ErrorCode.FORBIDDEN]: "Forbidden, you are not allowed to do this operation!",
  [ErrorCode.BAD_REQUEST]: "BadRequest, unknown client side error!",
  [ErrorCode.INVALID_QUERY]: "Invalid input query!",
  [ErrorCode.INVALID_PARAMS]: "Invalid input parameter!",
  [ErrorCode.INVALID_BODY]: "Invalid input body!",
  [ErrorCode.FAILED_ON_AUTHENTICATION]: "Authentication failed!",
  [ErrorCode.FOREIGN_KEY_CONSTRAINT]: (field?: string) => {
    return `Foreign key constraint${field ? ` on field ${field}` : "!"}`;
  },
  [ErrorCode.UNIQUE_CONSTRAINT]: (field?: string) => {
    return `Unique constraint${field ? ` on field ${field}` : "!"}`;
  },
  [ErrorCode.NON_EXISTENT_RESOURCE]: "Non-existent resource!",
  [ErrorCode.RESOURCE_NOT_FOUND]: "Resource not found!",
  [ErrorCode.INTERNAL_SERVER_ERROR]:
    "Internal server error, please try again later!",

  /**
   * Additional Key
   */

  NAN_PARAMS: (params: string) => {
    return `Invalid URL params on ${params} (one or more parameter is not a number)!`;
  },
};
