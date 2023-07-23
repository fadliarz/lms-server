"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_js_1 = __importDefault(require("crypto-js"));
const sha256Encrypt = (text) => {
    return crypto_js_1.default.SHA3(text).toString();
};
exports.default = sha256Encrypt;
