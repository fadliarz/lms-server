"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isEqualOrIncludeRole_1 = __importDefault(require("./isEqualOrIncludeRole"));
const course_type_1 = require("../../modules/course/course.type");
function getRoleStatus(userRole) {
    const isAdmin = (0, isEqualOrIncludeRole_1.default)(userRole, course_type_1.UserRoleModel.OWNER);
    const isInstructor = (0, isEqualOrIncludeRole_1.default)(userRole, course_type_1.UserRoleModel.INSTRUCTOR);
    const isStudent = (0, isEqualOrIncludeRole_1.default)(userRole, course_type_1.UserRoleModel.STUDENT);
    return {
        isAdmin,
        isInstructor,
        isStudent,
    };
}
exports.default = getRoleStatus;
