"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorException = void 0;
const statusCode_1 = require("common/constants/statusCode");
const HttpException_1 = __importDefault(require("./HttpException"));
class InternalServerErrorException extends HttpException_1.default {
    constructor() {
        super(statusCode_1.StatusCode.SERVER_ERROR, "Internal server error, try again later!");
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
