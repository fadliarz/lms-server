"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$CourseScheduleAPI = void 0;
var $CourseScheduleAPI;
(function ($CourseScheduleAPI) {
    const root = "/courses/:courseId/schedules";
    const schedule = root + "/:scheduleId";
    let CreateSchedule;
    (function (CreateSchedule) {
        CreateSchedule.endpoint = root;
        CreateSchedule.generateUrl = (courseId) => `/courses/${courseId}/schedules`;
    })(CreateSchedule = $CourseScheduleAPI.CreateSchedule || ($CourseScheduleAPI.CreateSchedule = {}));
    let GetSchedules;
    (function (GetSchedules) {
        GetSchedules.endpoint = root;
        GetSchedules.generateUrl = (courseId) => `/courses/${courseId}/schedules`;
    })(GetSchedules = $CourseScheduleAPI.GetSchedules || ($CourseScheduleAPI.GetSchedules = {}));
    let GetScheduleById;
    (function (GetScheduleById) {
        GetScheduleById.endpoint = root;
        GetScheduleById.generateUrl = (courseId, scheduleId) => `/courses/${courseId}/schedules/${scheduleId}`;
    })(GetScheduleById = $CourseScheduleAPI.GetScheduleById || ($CourseScheduleAPI.GetScheduleById = {}));
    let UpdateSchedule;
    (function (UpdateSchedule) {
        UpdateSchedule.endpoint = root;
        UpdateSchedule.generateUrl = (courseId, scheduleId) => `/courses/${courseId}/schedules/${scheduleId}`;
    })(UpdateSchedule = $CourseScheduleAPI.UpdateSchedule || ($CourseScheduleAPI.UpdateSchedule = {}));
    let DeleteSchedule;
    (function (DeleteSchedule) {
        DeleteSchedule.endpoint = root;
        DeleteSchedule.generateUrl = (courseId, scheduleId) => `/courses/${courseId}/schedules/${scheduleId}`;
    })(DeleteSchedule = $CourseScheduleAPI.DeleteSchedule || ($CourseScheduleAPI.DeleteSchedule = {}));
})($CourseScheduleAPI || (exports.$CourseScheduleAPI = $CourseScheduleAPI = {}));
