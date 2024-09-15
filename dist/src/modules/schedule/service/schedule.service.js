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
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
let CourseScheduleService = class CourseScheduleService {
    createSchedule(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params } = resourceId;
                const { courseId } = params;
                yield this.authorization.authorizeCreateSchedule(user, courseId);
                return this.repository.createSchedule(params, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getSchedules(resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params: { courseId }, } = resourceId;
                yield this.authorization.authorizeReadSchedule(user, courseId);
                return this.repository.getSchedules({ courseId }, query);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getScheduleById(scheduleId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params } = resourceId;
                const { courseId } = params;
                yield this.authorization.authorizeReadSchedule(user, courseId);
                return this.repository.getScheduleByIdOrThrow({
                    scheduleId,
                    resourceId: params,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateSchedule(scheduleId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params } = resourceId;
                const { courseId } = params;
                yield this.authorization.authorizeUpdateSchedule(user, courseId);
                return this.repository.updateSchedule({ scheduleId, resourceId: params }, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteSchedule(scheduleId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, params } = resourceId;
                const { courseId } = params;
                yield this.authorization.authorizeDeleteSchedule(user, courseId);
                return this.repository.deleteSchedule({ scheduleId, resourceId: params });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(schedule_type_1.CourseScheduleDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseScheduleService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(schedule_type_1.CourseScheduleDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseScheduleService.prototype, "authorization", void 0);
CourseScheduleService = __decorate([
    (0, inversify_1.injectable)()
], CourseScheduleService);
exports.default = CourseScheduleService;
