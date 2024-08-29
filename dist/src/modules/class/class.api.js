"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$CourseClassAPI = void 0;
var $CourseClassAPI;
(function ($CourseClassAPI) {
    const root = "/courses/:courseId/classes";
    const theClass = root + "/:classId";
    let CreateClass;
    (function (CreateClass) {
        CreateClass.endpoint = root;
        CreateClass.generateUrl = (courseId) => `/courses/${courseId}/classes`;
    })(CreateClass = $CourseClassAPI.CreateClass || ($CourseClassAPI.CreateClass = {}));
    let GetClasses;
    (function (GetClasses) {
        GetClasses.endpoint = root;
        GetClasses.generateUrl = (courseId) => `/courses/${courseId}/classes`;
    })(GetClasses = $CourseClassAPI.GetClasses || ($CourseClassAPI.GetClasses = {}));
    let GetClassById;
    (function (GetClassById) {
        GetClassById.endpoint = theClass;
        GetClassById.generateUrl = (courseId, classId) => `/courses/${courseId}/classes/${classId}`;
    })(GetClassById = $CourseClassAPI.GetClassById || ($CourseClassAPI.GetClassById = {}));
    let UpdateClass;
    (function (UpdateClass) {
        UpdateClass.endpoint = theClass;
        UpdateClass.generateUrl = (courseId, classId) => `/courses/${courseId}/classes/${classId}`;
    })(UpdateClass = $CourseClassAPI.UpdateClass || ($CourseClassAPI.UpdateClass = {}));
    let DeleteClass;
    (function (DeleteClass) {
        DeleteClass.endpoint = theClass;
        DeleteClass.generateUrl = (courseId, classId) => `/courses/${courseId}/classes/${classId}`;
    })(DeleteClass = $CourseClassAPI.DeleteClass || ($CourseClassAPI.DeleteClass = {}));
})($CourseClassAPI || (exports.$CourseClassAPI = $CourseClassAPI = {}));
