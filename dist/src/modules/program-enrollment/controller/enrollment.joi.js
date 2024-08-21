"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDepartmentProgramEnrollmentDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateDepartmentProgramEnrollmentDtoJoi = joi_1.default.object({
    userId: joi_1.default.number().required(),
});
