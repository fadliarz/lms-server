"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = __importDefault(require("./HttpException"));
const statusCode_1 = require("../../constants/statusCode");
const errorCode_1 = require("../../constants/errorCode");
const errorMessage_1 = require("../../constants/errorMessage");
class RecordNotFoundException extends HttpException_1.default {
    constructor(message) {
        super(statusCode_1.StatusCode.NOT_FOUND, errorCode_1.ErrorCode.RESOURCE_NOT_FOUND, message || errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.RESOURCE_NOT_FOUND], true);
    }
}
exports.default = RecordNotFoundException;
