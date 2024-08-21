"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePersonalAssignmentDtoJoi = exports.CreatePersonalAssignmentDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.CreatePersonalAssignmentDtoJoi = joi_1.default.object({
    title: joi_1.default.string().required(),
    submission: joi_1.default.string().required(),
    deadline: joi_1.default.date().required(),
});
exports.UpdatePersonalAssignmentDtoJoi = joi_1.default.object({
    title: joi_1.default.string(),
    submission: joi_1.default.string(),
    deadline: joi_1.default.date(),
    isDone: joi_1.default.boolean().required(),
});
