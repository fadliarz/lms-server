"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentRoleModel = exports.UserRoleModel = exports.courseUrls = exports.CourseDITypes = void 0;
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
    courseUrls["enrolled"] = "/enrolled";
    courseUrls["course"] = "/:courseId";
    courseUrls["likes"] = "/:courseId/likes";
    courseUrls["like"] = "/:courseId/likes/:likeId";
    courseUrls["category"] = "/categories";
})(courseUrls || (exports.courseUrls = courseUrls = {}));
exports.UserRoleModel = client_1.Role;
exports.CourseEnrollmentRoleModel = client_1.CourseEnrollmentRole;
