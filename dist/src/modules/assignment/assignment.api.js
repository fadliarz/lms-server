"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$CourseClassAssignmentAPI = void 0;
var $CourseClassAssignmentAPI;
(function ($CourseClassAssignmentAPI) {
    const root = "/courses/:courseId/classes/:classId/assignments";
    const assignment = root + "/:assignmentId";
    let CreateAssignment;
    (function (CreateAssignment) {
        CreateAssignment.endpoint = root;
        CreateAssignment.generateUrl = (courseId, classId) => `/courses/${courseId}/classes/${classId}/assignments`;
    })(CreateAssignment = $CourseClassAssignmentAPI.CreateAssignment || ($CourseClassAssignmentAPI.CreateAssignment = {}));
    let GetAssignments;
    (function (GetAssignments) {
        GetAssignments.endpoint = root;
        GetAssignments.generateUrl = (courseId, classId) => `/courses/${courseId}/classes/${classId}/assignments`;
    })(GetAssignments = $CourseClassAssignmentAPI.GetAssignments || ($CourseClassAssignmentAPI.GetAssignments = {}));
    let GetAssignmentById;
    (function (GetAssignmentById) {
        GetAssignmentById.endpoint = assignment;
        GetAssignmentById.generateUrl = (courseId, classId, assignmentId) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`;
    })(GetAssignmentById = $CourseClassAssignmentAPI.GetAssignmentById || ($CourseClassAssignmentAPI.GetAssignmentById = {}));
    let UpdateAssignment;
    (function (UpdateAssignment) {
        UpdateAssignment.endpoint = assignment;
        UpdateAssignment.generateUrl = (courseId, classId, assignmentId) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`;
    })(UpdateAssignment = $CourseClassAssignmentAPI.UpdateAssignment || ($CourseClassAssignmentAPI.UpdateAssignment = {}));
    let DeleteAssignment;
    (function (DeleteAssignment) {
        DeleteAssignment.endpoint = assignment;
        DeleteAssignment.generateUrl = (courseId, classId, assignmentId) => `/courses/${courseId}/classes/${classId}/assignments/${assignmentId}`;
    })(DeleteAssignment = $CourseClassAssignmentAPI.DeleteAssignment || ($CourseClassAssignmentAPI.DeleteAssignment = {}));
})($CourseClassAssignmentAPI || (exports.$CourseClassAssignmentAPI = $CourseClassAssignmentAPI = {}));
