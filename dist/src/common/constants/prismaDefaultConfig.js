"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDefaultTransactionConfigForWrite = exports.PrismaDefaultTransactionConfigForRead = void 0;
const client_1 = require("@prisma/client");
exports.PrismaDefaultTransactionConfigForRead = {
    isolationLevel: client_1.Prisma.TransactionIsolationLevel.ReadCommitted,
    maxWait: 5000,
    timeout: 8000,
};
exports.PrismaDefaultTransactionConfigForWrite = {
    isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 5000,
    timeout: 8000,
};
