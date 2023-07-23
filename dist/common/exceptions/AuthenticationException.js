"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationException = void 0;
const HttpException_1 = __importDefault(require("./HttpException"));
const statusCode_1 = require("../../common/constants/statusCode");
class AuthenticationException extends HttpException_1.default {
    constructor() {
        super(statusCode_1.StatusCode.UNAUTHENTICATED, "Unathenticated!");
    }
}
exports.AuthenticationException = AuthenticationException;
