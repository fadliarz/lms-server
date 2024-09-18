"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$CourseLessonVideoAPI = void 0;
var $CourseLessonVideoAPI;
(function ($CourseLessonVideoAPI) {
    const root = "/courses/:courseId/lessons/:lessonId/videos";
    const video = root + "/:videoId";
    let CreateVideo;
    (function (CreateVideo) {
        CreateVideo.endpoint = root;
        CreateVideo.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/videos`;
    })(CreateVideo = $CourseLessonVideoAPI.CreateVideo || ($CourseLessonVideoAPI.CreateVideo = {}));
    let GetVideos;
    (function (GetVideos) {
        GetVideos.endpoint = root;
        GetVideos.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/videos`;
    })(GetVideos = $CourseLessonVideoAPI.GetVideos || ($CourseLessonVideoAPI.GetVideos = {}));
    let GetVideoById;
    (function (GetVideoById) {
        GetVideoById.endpoint = video;
        GetVideoById.generateUrl = (courseId, lessonId, videoId) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`;
    })(GetVideoById = $CourseLessonVideoAPI.GetVideoById || ($CourseLessonVideoAPI.GetVideoById = {}));
    let UpdateVideo;
    (function (UpdateVideo) {
        UpdateVideo.endpoint = video;
        UpdateVideo.generateUrl = (courseId, lessonId, videoId) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`;
    })(UpdateVideo = $CourseLessonVideoAPI.UpdateVideo || ($CourseLessonVideoAPI.UpdateVideo = {}));
    let DeleteVideo;
    (function (DeleteVideo) {
        DeleteVideo.endpoint = video;
        DeleteVideo.generateUrl = (courseId, lessonId, videoId) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`;
    })(DeleteVideo = $CourseLessonVideoAPI.DeleteVideo || ($CourseLessonVideoAPI.DeleteVideo = {}));
})($CourseLessonVideoAPI || (exports.$CourseLessonVideoAPI = $CourseLessonVideoAPI = {}));
