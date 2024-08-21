"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDepartmentDivisionCoLeaderIdDtoJoi = exports.UpdateDepartmentDivisionLeaderIdDtoJoi = exports.UpdateDepartmentDivisionDtoJoi = exports.CreateDepartmentDivisionDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateDepartmentDivisionDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
    leaderId: joi_1.default.number(),
    coLeaderId: joi_1.default.number(),
});
exports.UpdateDepartmentDivisionDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
});
exports.UpdateDepartmentDivisionLeaderIdDtoJoi = joi_1.default.object({
    leaderId: joi_1.default.number().required(),
});
exports.UpdateDepartmentDivisionCoLeaderIdDtoJoi = joi_1.default.object({
    coLeaderId: joi_1.default.number().required(),
});
