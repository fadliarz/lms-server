import { ErrorCode } from "./errorCode";
import { ErrorMessage } from "./errorMessage";

type PrismaErrorCode = "P2002" | "P2003" | "P2025";

const PrismaError: Record<
  PrismaErrorCode,
  {
    errorCode: string;
    message: string;
  }
> = {
  P2002: {
    errorCode: ErrorCode.UNIQUE_CONSTRAINT,
    message: (
      ErrorMessage[ErrorCode.UNIQUE_CONSTRAINT] as (field?: string) => string
    )(),
  },
  P2003: {
    errorCode: ErrorCode.FOREIGN_KEY_CONSTRAINT,
    message: (
      ErrorMessage[ErrorCode.FOREIGN_KEY_CONSTRAINT] as (
        field?: string
      ) => string
    )(),
  },
  P2025: {
    errorCode: ErrorCode.NON_EXISTENT_RESOURCE,
    message: ErrorMessage[ErrorCode.NON_EXISTENT_RESOURCE] as string,
  },
};

export default PrismaError;
