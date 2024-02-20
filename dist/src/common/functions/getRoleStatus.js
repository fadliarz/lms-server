"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const isEqualOrIncludeRole_1 = __importDefault(require("./isEqualOrIncludeRole"));
function getRoleStatus(userRole) {
    const isAdmin = (0, isEqualOrIncludeRole_1.default)(userRole, client_1.Role.OWNER);
    const isInstructor = (0, isEqualOrIncludeRole_1.default)(userRole, client_1.Role.INSTRUCTOR);
    const isStudent = (0, isEqualOrIncludeRole_1.default)(userRole, client_1.Role.STUDENT);
    return {
        isAdmin,
        isInstructor,
        isStudent,
    };
}
exports.default = getRoleStatus;
