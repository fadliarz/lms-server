import handlePrismaRepositoryError from "./handlePrismaRepositoryError";

export type DatabaseOperationConstraint = {
  uniqueConstraint?: Record<string, { message: string }> & {
    default?: { message: string };
  };
  foreignConstraint?: Record<string, { message: string }> & {
    default?: { message: string };
  };
  recordNotFound?: Record<string, { message: string }> & {
    default?: { message: string };
  };
};

export default function handleRepositoryError(
  error: Error,
  constraint?: DatabaseOperationConstraint,
): Error {
  return handlePrismaRepositoryError(error, constraint);
}
