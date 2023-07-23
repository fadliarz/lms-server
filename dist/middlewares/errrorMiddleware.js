"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorMiddleware(error, req, res, next) {
    const statusCode = error.statusCode;
    const message = error.customMessage;
    res.status(statusCode).json({
        statusCode,
        message,
    });
}
exports.default = errorMiddleware;
