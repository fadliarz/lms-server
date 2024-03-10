"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignIn = exports.UpdateBasicUserDtoJoi = exports.CreateUserDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateUserDtoJoi = joi_1.default.object({
    /**
     * Required
     *
     */
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    NIM: joi_1.default.string().required(),
    /**
     * Optional
     *
     */
    phoneNumber: joi_1.default.string(),
    avatar: joi_1.default.string(),
    about: joi_1.default.string(),
});
exports.UpdateBasicUserDtoJoi = joi_1.default.object({
    /**
     * Optional
     *
     */
    name: joi_1.default.string(),
    NIM: joi_1.default.string(),
    avatar: joi_1.default.string(),
    about: joi_1.default.string(),
});
exports.SignIn = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
