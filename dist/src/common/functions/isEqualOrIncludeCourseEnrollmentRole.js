"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEqualOrIncludeCourseEnrollmentRole(firstRole, secondRole) {
    if (Array.isArray(secondRole)) {
        return secondRole
            .map((role) => role.toString())
            .includes(firstRole.toString());
    }
    return firstRole.toString() === secondRole.toString();
}
exports.default = isEqualOrIncludeCourseEnrollmentRole;
