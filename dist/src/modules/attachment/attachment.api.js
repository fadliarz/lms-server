"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$CourseLessonAttachmentAPI = void 0;
var $CourseLessonAttachmentAPI;
(function ($CourseLessonAttachmentAPI) {
    const root = "/courses/:courseId/lessons/:lessonId/attachments";
    const attachment = root + "/:attachmentId";
    let CreateAttachment;
    (function (CreateAttachment) {
        CreateAttachment.endpoint = root;
        CreateAttachment.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/attachments`;
    })(CreateAttachment = $CourseLessonAttachmentAPI.CreateAttachment || ($CourseLessonAttachmentAPI.CreateAttachment = {}));
    let GetAttachments;
    (function (GetAttachments) {
        GetAttachments.endpoint = root;
        GetAttachments.generateUrl = (courseId, lessonId) => `/courses/${courseId}/lessons/${lessonId}/attachments`;
    })(GetAttachments = $CourseLessonAttachmentAPI.GetAttachments || ($CourseLessonAttachmentAPI.GetAttachments = {}));
    let GetAttachmentById;
    (function (GetAttachmentById) {
        GetAttachmentById.endpoint = attachment;
        GetAttachmentById.generateUrl = (courseId, lessonId, attachmentId) => `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`;
    })(GetAttachmentById = $CourseLessonAttachmentAPI.GetAttachmentById || ($CourseLessonAttachmentAPI.GetAttachmentById = {}));
    let UpdateAttachment;
    (function (UpdateAttachment) {
        UpdateAttachment.endpoint = attachment;
        UpdateAttachment.generateUrl = (courseId, lessonId, attachmentId) => `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`;
    })(UpdateAttachment = $CourseLessonAttachmentAPI.UpdateAttachment || ($CourseLessonAttachmentAPI.UpdateAttachment = {}));
    let DeleteAttachment;
    (function (DeleteAttachment) {
        DeleteAttachment.endpoint = attachment;
        DeleteAttachment.generateUrl = (courseId, lessonId, attachmentId) => `/courses/${courseId}/lessons/${lessonId}/attachments/${attachmentId}`;
    })(DeleteAttachment = $CourseLessonAttachmentAPI.DeleteAttachment || ($CourseLessonAttachmentAPI.DeleteAttachment = {}));
})($CourseLessonAttachmentAPI || (exports.$CourseLessonAttachmentAPI = $CourseLessonAttachmentAPI = {}));
