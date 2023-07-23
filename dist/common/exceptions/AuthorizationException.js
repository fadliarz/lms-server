"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationException = void 0;
const HttpException_1 = __importDefault(require("./HttpException"));
const statusCode_1 = require("../../common/constants/statusCode");
class AuthorizationException extends HttpException_1.default {
    constructor() {
        super(statusCode_1.StatusCode.UNAUTHORIZED, "Unauthorized!");
    }
}
exports.AuthorizationException = AuthorizationException;
