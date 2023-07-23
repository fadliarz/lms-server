"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseUrls = exports.CourseDITypes = void 0;
exports.CourseDITypes = {
    COURSE_REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
    COURSE_SERVICE: Symbol.for("COURSE_SERVICE"),
    COURSE_CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
};
var courseUrls;
(function (courseUrls) {
    courseUrls["root"] = "/course";
    courseUrls["create"] = "/create";
})(courseUrls || (exports.courseUrls = courseUrls = {}));
