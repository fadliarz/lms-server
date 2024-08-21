"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const course_type_1 = require("../../modules/course/course.type");
function getUserRoleArray() {
    const roles = [];
    for (const roleKey of Object.keys(course_type_1.UserRoleModel)) {
        roles.push(course_type_1.UserRoleModel[roleKey]);
    }
    return roles;
}
exports.default = getUserRoleArray;
