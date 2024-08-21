"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDepartmentProgramDtoJoi = exports.CreateDepartmentProgramDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateDepartmentProgramDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    date: joi_1.default.date().required(),
});
exports.UpdateDepartmentProgramDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
    date: joi_1.default.date(),
});
