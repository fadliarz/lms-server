"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaError_1 = require("../constants/prismaError");
const HttpException_1 = __importDefault(require("../class/exceptions/HttpException"));
const statusCode_1 = require("../constants/statusCode");
const errorCode_1 = require("../constants/errorCode");
const InternalServerException_1 = __importDefault(require("../class/exceptions/InternalServerException"));
const RecordNotFoundException_1 = __importDefault(require("../class/exceptions/RecordNotFoundException"));
function handlePrismaRepositoryError(error, constraint) {
    var _a;
    console.log("[@handlePrismaRepositoryError error]: ", error);
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        /**
         * template: "Foreign key constraint failed on the field: {field_name}"
         *
         */
        if (error.code === prismaError_1.PrismaErrorCode.FOREIGN_KEY_CONSTRAINT) {
            const defaultError = new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT, error.message);
            if (!constraint) {
                return defaultError;
            }
            if (!constraint.foreignConstraint) {
                return defaultError;
            }
            const field = error.message.split("field: ")[1];
            const foreignConstraint = constraint.foreignConstraint;
            if (foreignConstraint.hasOwnProperty(field)) {
                return new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT, foreignConstraint[field].message);
            }
            if (foreignConstraint.default) {
                return new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT, foreignConstraint.default.message);
            }
            return defaultError;
        }
        /**
         * template: "Unique constraint failed on the {constraint}"
         *
         */
        if (error.code === prismaError_1.PrismaErrorCode.UNIQUE_CONSTRAINT) {
            const defaultError = new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.UNIQUE_CONSTRAINT, error.message);
            if (!constraint) {
                return defaultError;
            }
            if (!constraint.uniqueConstraint) {
                return defaultError;
            }
            const field = ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target).join("&");
            const uniqueConstraint = constraint.uniqueConstraint;
            if (uniqueConstraint.hasOwnProperty(field)) {
                return new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.UNIQUE_CONSTRAINT, uniqueConstraint[field].message);
            }
            if (uniqueConstraint.default) {
                return new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.UNIQUE_CONSTRAINT, uniqueConstraint.default.message);
            }
            return defaultError;
        }
        if (error.code === prismaError_1.PrismaErrorCode.RECORD_NOT_FOUND) {
            return new RecordNotFoundException_1.default();
        }
    }
    if (error instanceof HttpException_1.default) {
        return error;
    }
    return new InternalServerException_1.default();
}
exports.default = handlePrismaRepositoryError;
