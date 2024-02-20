"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
const errorCode_1 = require("./errorCode");
exports.ErrorMessage = {
    [errorCode_1.ErrorCode.UNAUTHENTICATED]: "Unauthenticated, please login first!",
    [errorCode_1.ErrorCode.UNAUTHORIZED]: "Unauthorized, you are not allowed to do this operation!",
    [errorCode_1.ErrorCode.BAD_REQUEST]: "BadRequest, unknown client side error!",
    [errorCode_1.ErrorCode.INVALID_QUERY]: "Invalid input query!",
    [errorCode_1.ErrorCode.INVALID_PARAMS]: "Invalid input parameter!",
    [errorCode_1.ErrorCode.INVALID_BODY]: "Invalid input body!",
    [errorCode_1.ErrorCode.FAILED_ON_AUTHENTICATION]: "Authentication failed!",
    [errorCode_1.ErrorCode.FOREIGN_KEY_CONSTRAINT]: (field) => {
        return `Foreign key constraint${field ? ` on field ${field}` : "!"}`;
    },
    [errorCode_1.ErrorCode.UNIQUE_CONSTRAINT]: (field) => {
        return `Unique constraint${field ? ` on field ${field}` : "!"}`;
    },
    [errorCode_1.ErrorCode.NON_EXISTENT_RESOURCE]: "Non-existent resource!",
    [errorCode_1.ErrorCode.RESOURCE_NOT_FOUND]: "Resource not found!",
    [errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR]: "Internal server error, please try again later!",
    /**
     * Additional Key
     */
    NAN_PARAMS: (params) => {
        return `Invalid URL params on ${params} (one or more parameter is not a number)!`;
    },
};
