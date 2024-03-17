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
exports.CourseLessonController = void 0;
const inversify_1 = require("inversify");
const lesson_type_1 = require("../lesson.type");
const statusCode_1 = require("../../../common/constants/statusCode");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const lesson_joi_1 = require("./lesson.joi");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const removeNullFields_1 = __importDefault(require("../../../common/functions/removeNullFields"));
let CourseLessonController = class CourseLessonController {
    createLesson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: lesson_joi_1.CreateCourseLessonDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newLesson = yield this.service.createLesson(resourceId, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: (0, removeNullFields_1.default)(newLesson),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLessonById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonId = this.validateLessonId(req);
                const resourceId = this.validateUnauthenticatedResourceId(req);
                const lesson = yield this.service.getLessonById(lessonId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: (0, removeNullFields_1.default)(lesson),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLessons(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceId = this.validateUnauthenticatedResourceId(req);
                const lessons = yield this.service.getLessons(resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: lessons.map((lesson) => (0, removeNullFields_1.default)(lesson)),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateBasicLesson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: lesson_joi_1.UpdateBasicCourseLessonDtoJoi })(req, res, next);
                const lessonId = this.validateLessonId(req);
                const resourceId = this.validateResourceId(req);
                const updatedLesson = yield this.service.updateBasicLesson(lessonId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: (0, removeNullFields_1.default)(updatedLesson),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteLesson(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lessonId = this.validateLessonId(req);
                const resourceId = this.validateResourceId(req);
                yield this.service.deleteLesson(lessonId, resourceId);
                res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const { id: userId, role } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return {
            user: { id: userId, role },
            courseId,
        };
    }
    validateUnauthenticatedResourceId(req) {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return {
            courseId,
        };
    }
    validateLessonId(req) {
        const lessonId = Number(req.params.lessonId);
        if (isNaN(lessonId)) {
            throw new NaNException_1.default("lessonId");
        }
        return lessonId;
    }
};
exports.CourseLessonController = CourseLessonController;
__decorate([
    (0, inversify_1.inject)(lesson_type_1.CourseLessonDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseLessonController.prototype, "service", void 0);
exports.CourseLessonController = CourseLessonController = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonController);
