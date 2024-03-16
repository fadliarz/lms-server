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
function handlePrismaRepositoryError(error, constraint) {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === prismaError_1.PrismaErrorCode.FOREIGN_KEY_CONSTRAINT) {
            // template: "Foreign key constraint failed on the field: {field_name}"
            const field = error.message.split("field: ")[1];
            const foreignConstraint = constraint.foreignConstraint;
            if (foreignConstraint && foreignConstraint.hasOwnProperty(field)) {
                return new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT, foreignConstraint[field].message);
            }
        }
        if (error.code === prismaError_1.PrismaErrorCode.UNIQUE_CONSTRAINT) {
            // template: "Unique constraint failed on the {constraint}"
            const field = error.message.split("on the ")[1];
            const uniqueConstraint = constraint.foreignConstraint;
            if (uniqueConstraint && uniqueConstraint.hasOwnProperty(field)) {
                return new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT, uniqueConstraint[field].message);
            }
        }
    }
    return new InternalServerException_1.default();
}
exports.default = handlePrismaRepositoryError;
