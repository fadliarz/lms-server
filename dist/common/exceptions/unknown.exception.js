"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerErrorException = void 0;
const http_exception_1 = __importDefault(require("./http.exception"));
class InternalServerErrorException extends http_exception_1.default {
    constructor() {
        super(500, "Something went wrong");
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
