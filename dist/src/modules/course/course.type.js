"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentRoleModel = exports.CourseStatusModel = exports.UserRoleModel = exports.CourseErrorMessage = exports.courseUrls = exports.CourseDITypes = void 0;
const client_1 = require("@prisma/client");
exports.CourseDITypes = {
    REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
};
var courseUrls;
(function (courseUrls) {
    courseUrls["root"] = "/courses";
    courseUrls["course"] = "/:courseId";
    courseUrls["basic"] = "/:courseId/basic";
    courseUrls["status"] = "/:courseId/status";
    courseUrls["category"] = "/:courseId/category";
    courseUrls["enrolled"] = "/enrolled";
    courseUrls["likes"] = "/:courseId/likes";
    courseUrls["like"] = "/:courseId/likes/:likeId";
})(courseUrls || (exports.courseUrls = courseUrls = {}));
var CourseErrorMessage;
(function (CourseErrorMessage) {
    CourseErrorMessage["COURSE_DOES_NOT_EXIST"] = "course doesn't exist!";
})(CourseErrorMessage || (exports.CourseErrorMessage = CourseErrorMessage = {}));
exports.UserRoleModel = client_1.Role;
exports.CourseStatusModel = client_1.CourseStatus;
exports.CourseEnrollmentRoleModel = client_1.CourseEnrollmentRole;
