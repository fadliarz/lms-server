"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseScheduleDITypes = void 0;
exports.CourseScheduleDITypes = {
    REPOSITORY: Symbol.for("COURSE_SCHEDULE_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_SCHEDULE_EVENT_SERVICE"),
    CONTROLLER: Symbol.for("COURSE_SCHEDULE_EVENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_SCHEDULE_EVENT_AUTHORIZATION"),
};
