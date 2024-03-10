"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseLessonUrls = exports.CourseLessonDITypes = void 0;
exports.CourseLessonDITypes = {
    REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
};
var courseLessonUrls;
(function (courseLessonUrls) {
    courseLessonUrls["root"] = "/courses/:courseId/lessons";
    courseLessonUrls["lesson"] = "/courses/:courseId/lessons/:lessonId";
})(courseLessonUrls || (exports.courseLessonUrls = courseLessonUrls = {}));
