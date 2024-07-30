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
const lesson_type_1 = require("../lesson.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
let CourseLessonService = class CourseLessonService {
    createLesson(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createLesson(resourceId, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    foreignConstraint: {
                        default: { message: "Course doesn't exist!" },
                    },
                });
            }
        });
    }
    getLessonById(lessonId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.validateRelationBetweenResources({
                lessonId,
                resourceId,
            });
            return lesson;
        });
    }
    getLessons(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getLessons(resourceId);
        });
    }
    updateBasicLesson(lessonId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ lessonId, resourceId });
            return yield this.repository.updateLesson(lessonId, resourceId, dto);
        });
    }
    deleteLesson(lessonId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ lessonId, resourceId });
            yield this.repository.deleteLesson(lessonId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lessonId, resourceId } = id;
            const { courseId } = resourceId;
            const lesson = yield this.repository.getLessonById(lessonId, resourceId);
            if (!lesson || lesson.courseId !== courseId) {
                throw new RecordNotFoundException_1.default();
            }
            return lesson;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(lesson_type_1.CourseLessonDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseLessonService.prototype, "repository", void 0);
CourseLessonService = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonService);
exports.default = CourseLessonService;
