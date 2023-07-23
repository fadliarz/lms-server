"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(statusCode, customMessage) {
        super();
        this.statusCode = statusCode;
        this.customMessage = customMessage;
    }
}
exports.default = HttpException;
