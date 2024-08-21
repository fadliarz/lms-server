"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const schedule_type_1 = require("../schedule.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const schedule_joi_1 = require("./schedule.joi");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const statusCode_1 = require("../../../common/constants/statusCode");
let CourseScheduleController = class CourseScheduleController {
    createSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: schedule_joi_1.CreateCourseScheduleDtoJoi })(req, res, next);
                const newSchedule = yield this.service.createSchedule(this.validateResourceId(req), req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newSchedule,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSchedules(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedules = yield this.service.getSchedules(this.validateResourceId(req));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: schedules,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getScheduleById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield this.service.getScheduleById(this.validateScheduleId(req), this.validateResourceId(req));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: schedule,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: schedule_joi_1.UpdateCourseScheduleDtoJoi })(req, res, next);
                const updatedSchedule = yield this.service.updateSchedule(this.validateScheduleId(req), this.validateResourceId(req), req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedSchedule,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteSchedule(this.validateScheduleId(req), this.validateResourceId(req));
                res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateScheduleId(req) {
        const scheduleId = Number(req.params.scheduleId);
        if (isNaN(scheduleId)) {
            throw new NaNException_1.default("scheduleId");
        }
        return scheduleId;
    }
    validateResourceId(req) {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return {
            user: (0, getRequestUserOrThrowAuthenticationException_1.default)(req),
            params: {
                courseId,
            },
        };
    }
};
__decorate([
    (0, inversify_1.inject)(schedule_type_1.CourseScheduleDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseScheduleController.prototype, "service", void 0);
CourseScheduleController = __decorate([
    (0, inversify_1.injectable)()
], CourseScheduleController);
exports.default = CourseScheduleController;
