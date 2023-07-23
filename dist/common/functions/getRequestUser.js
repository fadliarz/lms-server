"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestUser = void 0;
const statusCode_1 = require("../../common/constants/statusCode");
const HttpException_1 = __importDefault(require("../../common/exceptions/HttpException"));
function getRequestUser(req) {
    const authenticatedRequest = req;
    if (!authenticatedRequest.user) {
        throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, "Not authenticated!");
    }
    return authenticatedRequest.user;
}
exports.getRequestUser = getRequestUser;
