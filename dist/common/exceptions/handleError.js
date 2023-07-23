"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const HttpException_1 = __importDefault(require("./HttpException"));
const InternalServerException_1 = require("./InternalServerException");
function handleError(error, next) {
    if (!(error instanceof HttpException_1.default)) {
        next(new InternalServerException_1.InternalServerException());
    }
    next(error);
}
exports.handleError = handleError;
