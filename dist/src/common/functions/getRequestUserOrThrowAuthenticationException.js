"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationException_1 = __importDefault(require("../class/exceptions/AuthenticationException"));
function getRequestUserOrThrowAuthenticationException(req) {
    const authenticatedRequest = req;
    if (!authenticatedRequest.user) {
        throw new AuthenticationException_1.default();
    }
    return authenticatedRequest.user;
}
exports.default = getRequestUserOrThrowAuthenticationException;
