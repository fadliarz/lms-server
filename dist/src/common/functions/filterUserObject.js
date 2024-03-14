"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const removeNullFields_1 = __importDefault(require("./removeNullFields"));
function filterUserObject(user) {
    user.password = null;
    user.accessToken = null;
    user.refreshToken = null;
    return (0, removeNullFields_1.default)(user);
}
exports.default = filterUserObject;
