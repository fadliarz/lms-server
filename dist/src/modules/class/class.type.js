"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseClassErrorMessage = exports.courseClassUrls = exports.CourseClassDITypes = void 0;
exports.CourseClassDITypes = {
    REPOSITORY: Symbol.for("COURSE_CLASS_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_CLASS_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CLASS_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_CLASS_AUTHORIZATION"),
};
var courseClassUrls;
(function (courseClassUrls) {
    courseClassUrls["root"] = "/courses/:courseId/classes";
    courseClassUrls["class"] = "/courses/:courseId/classes/:classId";
})(courseClassUrls || (exports.courseClassUrls = courseClassUrls = {}));
var CourseClassErrorMessage;
(function (CourseClassErrorMessage) {
    CourseClassErrorMessage["CLASS_DOES_NOT_EXIST"] = "class doesn't exist!";
})(CourseClassErrorMessage || (exports.CourseClassErrorMessage = CourseClassErrorMessage = {}));
