"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReportDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UpdateReportDtoJoi = joi_1.default.object({
    points: joi_1.default.number(),
    performance: joi_1.default.number(),
    participation: joi_1.default.number(),
});
