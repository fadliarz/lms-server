"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../constants/statusCode");
const errorCode_1 = require("../../constants/errorCode");
const errorMessage_1 = require("../../constants/errorMessage");
const HttpException_1 = __importDefault(require("./HttpException"));
class InternalServerException extends HttpException_1.default {
    constructor(message) {
        super(statusCode_1.StatusCode.SERVER_ERROR, errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR, message || errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.INTERNAL_SERVER_ERROR], true);
    }
}
exports.default = InternalServerException;
