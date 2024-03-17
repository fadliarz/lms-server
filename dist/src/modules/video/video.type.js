"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseLessonVideoUrls = exports.CourseLessonVideoDITypes = void 0;
exports.CourseLessonVideoDITypes = {
    REPOSITORY: Symbol.for("COURSE_VIDEO_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_VIDEO_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_VIDEO_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_VIDEO_AUTHORIZATION"),
};
var courseLessonVideoUrls;
(function (courseLessonVideoUrls) {
    courseLessonVideoUrls["root"] = "/courses/:courseId/lessons/:lessonId/videos";
    courseLessonVideoUrls["video"] = "/courses/:courseId/lessons/:lessonId/videos/:videoId";
    courseLessonVideoUrls["basic"] = "/courses/:courseId/lessons/:lessonId/videos/:videoId/basic";
    courseLessonVideoUrls["source"] = "/courses/:courseId/lessons/:lessonId/videos/:videoId/source";
})(courseLessonVideoUrls || (exports.courseLessonVideoUrls = courseLessonVideoUrls = {}));
