"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDepartmentCoLeaderIdDtoJoi = exports.UpdateDepartmentLeaderIdDtoJoi = exports.UpdateDepartmentDtoJoi = exports.CreateDepartmentDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreateDepartmentDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string(),
});
exports.UpdateDepartmentDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    description: joi_1.default.string(),
});
exports.UpdateDepartmentLeaderIdDtoJoi = joi_1.default.object({
    leaderId: joi_1.default.number().required(),
});
exports.UpdateDepartmentCoLeaderIdDtoJoi = joi_1.default.object({
    coLeaderId: joi_1.default.number().required(),
});
