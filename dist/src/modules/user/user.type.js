"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivilegeModel = exports.UserDITypes = void 0;
exports.UserDITypes = {
    REPOSITORY: Symbol.for("USER_REPOSITORY"),
    SERVICE: Symbol.for("USER_SERVICE"),
    CONTROLLER: Symbol.for("USER_CONTROLLER"),
    AUTHORIZATION: Symbol.for("USER_AUTHORIZATION"),
};
exports.PrivilegeModel = {
    DEPARTMENT: "DEPARTMENT",
    DIVISION: "DIVISION",
    PROGRAM: "PROGRAM",
    SCHOLARSHIP: "SCHOLARSHIP",
    COMPETITION: "COMPETITION",
    REPORT: "REPORT",
    COURSE: "COURSE",
    EVENT: "EVENT",
    STORE: "STORE",
};
