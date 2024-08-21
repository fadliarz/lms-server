"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseClassAssignmentCompletionDITypes = exports.$CourseClassAssignmentCompletionAPI = void 0;
var $CourseClassAssignmentCompletionAPI;
(function ($CourseClassAssignmentCompletionAPI) {
    const root = "/courses/:courseId/classes/:classId/assignments/:assignmentId/completions";
    const completion = root + "/:completionId";
    let CreateCompletion;
    (function (CreateCompletion) {
        CreateCompletion.endpoint = root;
        CreateCompletion.generateUrl = (courseId, classId, assignmentId) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}/completions`;
    })(CreateCompletion = $CourseClassAssignmentCompletionAPI.CreateCompletion || ($CourseClassAssignmentCompletionAPI.CreateCompletion = {}));
    let DeleteCompletion;
    (function (DeleteCompletion) {
        DeleteCompletion.endpoint = completion;
        DeleteCompletion.generateUrl = (courseId, classId, assignmentId, completionId) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}/completions/${completionId}`;
    })(DeleteCompletion = $CourseClassAssignmentCompletionAPI.DeleteCompletion || ($CourseClassAssignmentCompletionAPI.DeleteCompletion = {}));
})($CourseClassAssignmentCompletionAPI || (exports.$CourseClassAssignmentCompletionAPI = $CourseClassAssignmentCompletionAPI = {}));
exports.CourseClassAssignmentCompletionDITypes = {
    REPOSITORY: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_CLASS_ASSIGNMENT_COMPLETION_AUTHORIZATION"),
};
