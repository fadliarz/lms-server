"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseEnrollmentRoleModel = exports.CourseStatusModel = exports.UserRoleModel = exports.CourseDITypes = exports.$CourseAPI = void 0;
var $CourseAPI;
(function ($CourseAPI) {
    const root = "/courses";
    const course = "/courses/:courseId";
    let CreateCourse;
    (function (CreateCourse) {
        CreateCourse.endpoint = root;
        CreateCourse.generateUrl = () => CreateCourse.endpoint;
    })(CreateCourse = $CourseAPI.CreateCourse || ($CourseAPI.CreateCourse = {}));
    let GetCourses;
    (function (GetCourses) {
        GetCourses.endpoint = root;
        GetCourses.generateUrl = () => GetCourses.endpoint;
    })(GetCourses = $CourseAPI.GetCourses || ($CourseAPI.GetCourses = {}));
    let GetCourseById;
    (function (GetCourseById) {
        GetCourseById.endpoint = course;
        GetCourseById.generateUrl = (courseId) => `/courses/${courseId}`;
    })(GetCourseById = $CourseAPI.GetCourseById || ($CourseAPI.GetCourseById = {}));
    let UpdateCourse;
    (function (UpdateCourse) {
        UpdateCourse.endpoint = course;
        UpdateCourse.generateUrl = (courseId) => `/courses/${courseId}`;
    })(UpdateCourse = $CourseAPI.UpdateCourse || ($CourseAPI.UpdateCourse = {}));
    let UpdateCourseStatus;
    (function (UpdateCourseStatus) {
        UpdateCourseStatus.endpoint = `${course}/status`;
        UpdateCourseStatus.generateUrl = (courseId) => `/courses/${courseId}/status`;
    })(UpdateCourseStatus = $CourseAPI.UpdateCourseStatus || ($CourseAPI.UpdateCourseStatus = {}));
    let UpdateCourseCategoryId;
    (function (UpdateCourseCategoryId) {
        UpdateCourseCategoryId.endpoint = `${course}/category`;
        UpdateCourseCategoryId.generateUrl = (courseId) => `/courses/${courseId}/category`;
    })(UpdateCourseCategoryId = $CourseAPI.UpdateCourseCategoryId || ($CourseAPI.UpdateCourseCategoryId = {}));
    let UpdateCourseCode;
    (function (UpdateCourseCode) {
        UpdateCourseCode.endpoint = `${course}/code`;
        UpdateCourseCode.generateUrl = (courseId) => `/courses/${courseId}/code`;
    })(UpdateCourseCode = $CourseAPI.UpdateCourseCode || ($CourseAPI.UpdateCourseCode = {}));
    let DeleteCourse;
    (function (DeleteCourse) {
        DeleteCourse.endpoint = course;
        DeleteCourse.generateUrl = (courseId) => `/courses/${courseId} `;
    })(DeleteCourse = $CourseAPI.DeleteCourse || ($CourseAPI.DeleteCourse = {}));
    let CreateLike;
    (function (CreateLike) {
        CreateLike.endpoint = `${course}/likes`;
        CreateLike.generateUrl = (courseId) => `/courses/${courseId}/likes`;
    })(CreateLike = $CourseAPI.CreateLike || ($CourseAPI.CreateLike = {}));
    let DeleteLike;
    (function (DeleteLike) {
        DeleteLike.endpoint = `${course}/likes/:likeId`;
        DeleteLike.generateUrl = (courseId, likeId) => `/courses/${courseId}/likes/${likeId}`;
    })(DeleteLike = $CourseAPI.DeleteLike || ($CourseAPI.DeleteLike = {}));
})($CourseAPI || (exports.$CourseAPI = $CourseAPI = {}));
exports.CourseDITypes = {
    REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
};
exports.UserRoleModel = {
    OWNER: "OWNER",
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
};
exports.CourseStatusModel = {
    PUBLISHED: "PUBLISHED",
    DRAFT: "DRAFT",
};
exports.CourseEnrollmentRoleModel = {
    INSTRUCTOR: "INSTRUCTOR",
    STUDENT: "STUDENT",
};
