"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseLessonDITypes = exports.$CourseLessonAPI = void 0;
var $CourseLessonAPI;
(function ($CourseLessonAPI) {
    const root = "/courses/:courseId/lessons";
    const lesson = root + "/:lessonId";
    let CreateLesson;
    (function (CreateLesson) {
        CreateLesson.endpoint = root;
        CreateLesson.generateUrl = (courseId) => `/courses/${courseId}/lessons`;
    })(CreateLesson = $CourseLessonAPI.CreateLesson || ($CourseLessonAPI.CreateLesson = {}));
    let GetLessons;
    (function (GetLessons) {
        GetLessons.endpoint = root;
        GetLessons.generateUrl = (courseId) => `/courses/${courseId}/lessons`;
    })(GetLessons = $CourseLessonAPI.GetLessons || ($CourseLessonAPI.GetLessons = {}));
    let GetLessonById;
    (function (GetLessonById) {
        GetLessonById.endpoint = lesson;
        GetLessonById.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`;
    })(GetLessonById = $CourseLessonAPI.GetLessonById || ($CourseLessonAPI.GetLessonById = {}));
    let UpdateLesson;
    (function (UpdateLesson) {
        UpdateLesson.endpoint = lesson;
        UpdateLesson.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`;
    })(UpdateLesson = $CourseLessonAPI.UpdateLesson || ($CourseLessonAPI.UpdateLesson = {}));
    let DeleteLesson;
    (function (DeleteLesson) {
        DeleteLesson.endpoint = lesson;
        DeleteLesson.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}`;
    })(DeleteLesson = $CourseLessonAPI.DeleteLesson || ($CourseLessonAPI.DeleteLesson = {}));
})($CourseLessonAPI || (exports.$CourseLessonAPI = $CourseLessonAPI = {}));
exports.CourseLessonDITypes = {
    REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
};
