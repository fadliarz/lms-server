"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEqualOrIncludeRole(firstRole, secondRole) {
    if (Array.isArray(secondRole)) {
        return secondRole
            .map((role) => role.toString())
            .includes(firstRole.toString());
    }
    return firstRole.toString() === secondRole.toString();
}
exports.default = isEqualOrIncludeRole;
