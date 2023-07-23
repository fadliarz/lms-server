"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCourse = void 0;
const joi_1 = __importDefault(require("joi"));
const CreateCourse = joi_1.default.object({
    image: joi_1.default.string(),
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
});
exports.CreateCourse = CreateCourse;
