"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNAUTHENTICATED"] = "LMS3000";
    ErrorCode["UNAUTHORIZED"] = "LMS3001";
    ErrorCode["BAD_REQUEST"] = "LMS4000";
    ErrorCode["INVALID_QUERY"] = "LMS4001";
    ErrorCode["INVALID_PARAMS"] = "LMS4002";
    ErrorCode["INVALID_BODY"] = "LMS4003";
    ErrorCode["FAILED_ON_AUTHENTICATION"] = "LMS4004";
    ErrorCode["FOREIGN_KEY_CONSTRAINT"] = "LMS4020";
    ErrorCode["UNIQUE_CONSTRAINT"] = "LMS4021";
    ErrorCode["NON_EXISTENT_RESOURCE"] = "LMS4022";
    ErrorCode["RESOURCE_NOT_FOUND"] = "LMS4040";
    ErrorCode["INTERNAL_SERVER_ERROR"] = "LMS5000";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
