import { Prisma } from "@prisma/client";

export const PrismaDefaultTransactionConfigForRead = {
  isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
  maxWait: 5000,
  timeout: 8000,
};

export const PrismaDefaultTransactionConfigForWrite = {
  isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  maxWait: 5000,
  timeout: 8000,
};
