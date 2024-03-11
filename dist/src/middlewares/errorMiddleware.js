"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("../common/class/exceptions/HttpException"));
const InternalServerException_1 = __importDefault(require("../common/class/exceptions/InternalServerException"));
const client_1 = require("@prisma/client");
const statusCode_1 = require("../common/constants/statusCode");
const errorCode_1 = require("../common/constants/errorCode");
const errorMessage_1 = require("../common/constants/errorMessage");
const prismaError_1 = __importDefault(require("../common/constants/prismaError"));
function errorMiddleware(error, req, res, next) {
    console.log("error: ", error);
    let statusCode;
    let errorCode;
    let message;
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        statusCode = statusCode_1.StatusCode.BAD_REQUEST;
        if (prismaError_1.default[error.code] !== undefined) {
            const errorInformation = prismaError_1.default[error.code];
            errorCode = errorInformation.errorCode;
            message = errorInformation.message;
        }
        else {
            errorCode = errorCode_1.ErrorCode.BAD_REQUEST;
            message = errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.BAD_REQUEST];
        }
        return res.status(statusCode).json({
            error: {
                errorCode,
                message,
            },
        });
    }
    if (!(error instanceof HttpException_1.default)) {
        error = new InternalServerException_1.default();
    }
    statusCode = error.status;
    message = error.message;
    errorCode = error.errorCode;
    return res.status(statusCode).json({
        error: {
            errorCode,
            message,
        },
    });
}
exports.default = errorMiddleware;
