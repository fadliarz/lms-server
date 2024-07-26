"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseClassAssignmentErrorMessage = exports.courseClassAssignmentUrls = exports.CourseClassAssignmentDITypes = void 0;
exports.CourseClassAssignmentDITypes = {
    REPOSITORY: Symbol.for("COURSE_CLASS_ASSIGNMENT_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_CLASS_ASSIGNMENT_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CLASS_ASSIGNMENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_CLASS_ASSIGNMENT_AUTHORIZATION"),
};
var courseClassAssignmentUrls;
(function (courseClassAssignmentUrls) {
    courseClassAssignmentUrls["root"] = "/courses/:courseId/classes/:classId/assignments";
    courseClassAssignmentUrls["assignment"] = "/courses/:courseId/classes/:classId/assignments/:assignmentId";
})(courseClassAssignmentUrls || (exports.courseClassAssignmentUrls = courseClassAssignmentUrls = {}));
var CourseClassAssignmentErrorMessage;
(function (CourseClassAssignmentErrorMessage) {
    CourseClassAssignmentErrorMessage["ASSIGNMENT_DOES_NOT_EXIST"] = "assignment doesn't exist!";
})(CourseClassAssignmentErrorMessage || (exports.CourseClassAssignmentErrorMessage = CourseClassAssignmentErrorMessage = {}));
