"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const schedule_type_1 = require("../schedule.type");
const schedule_api_1 = require("../schedule.api");
function CourseScheduleRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(schedule_type_1.CourseScheduleDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(schedule_api_1.$CourseScheduleAPI.CreateSchedule.endpoint, authenticationMiddleware, controller.createSchedule.bind(controller));
    /**
     * Get
     *
     */
    router.get(schedule_api_1.$CourseScheduleAPI.GetSchedules.endpoint, authenticationMiddleware, controller.getSchedules.bind(controller));
    router.get(schedule_api_1.$CourseScheduleAPI.GetScheduleById.endpoint, authenticationMiddleware, controller.getScheduleById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(schedule_api_1.$CourseScheduleAPI.UpdateSchedule.endpoint, authenticationMiddleware, controller.updateSchedule.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(schedule_api_1.$CourseScheduleAPI.DeleteSchedule.endpoint, authenticationMiddleware, controller.deleteSchedule.bind(controller));
    return router;
}
exports.default = CourseScheduleRouter;
