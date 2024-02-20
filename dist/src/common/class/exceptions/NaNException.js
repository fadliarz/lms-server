"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const statusCode_1 = require("../../constants/statusCode");
const errorCode_1 = require("../../constants/errorCode");
const errorMessage_1 = require("../../constants/errorMessage");
class NaNException extends HttpException_1.default {
    constructor(params) {
        super(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.INVALID_PARAMS, errorMessage_1.ErrorMessage.NAN_PARAMS(params), true);
    }
}
exports.default = NaNException;
