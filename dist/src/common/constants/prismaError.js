"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaErrorCode = void 0;
const errorCode_1 = require("./errorCode");
const errorMessage_1 = require("./errorMessage");
exports.PrismaErrorCode = {
    UNIQUE_CONSTRAINT: "P2002",
    FOREIGN_KEY_CONSTRAINT: "P2003",
    P2025: "P2025",
};
const PrismaError = {
    P2002: {
        errorCode: errorCode_1.ErrorCode.UNIQUE_CONSTRAINT,
        message: errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.UNIQUE_CONSTRAINT](),
    },
    P2003: {
        errorCode: errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT,
        message: errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT](),
    },
    P2025: {
        errorCode: errorCode_1.ErrorCode.NON_EXISTENT_RESOURCE,
        message: errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.NON_EXISTENT_RESOURCE],
    },
};
exports.default = PrismaError;
