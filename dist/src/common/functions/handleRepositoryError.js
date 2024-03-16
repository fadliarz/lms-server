"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlePrismaRepositoryError_1 = __importDefault(require("./handlePrismaRepositoryError"));
function handleRepositoryError(error, constraint) {
    return (0, handlePrismaRepositoryError_1.default)(error, constraint);
}
exports.default = handleRepositoryError;
