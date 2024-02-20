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
exports.CourseLessonService = void 0;
const inversify_1 = require("inversify");
const lesson_type_1 = require("../lesson.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let CourseLessonService = class CourseLessonService {
    createLesson(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createLesson(resourceId, dto);
        });
    }
    getLessonById(lessonId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.validateRelationBetweenResources({
                lessonId,
                resourceId,
            });
            if (!lesson) {
                throw new RecordNotFoundException_1.default();
            }
            return lesson;
        });
    }
    updateLesson(lessonId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ lessonId, resourceId }, new RecordNotFoundException_1.default());
            return yield this.repository.updateLesson(lessonId, resourceId, dto);
        });
    }
    deleteLesson(lessonId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ lessonId, resourceId }, new RecordNotFoundException_1.default());
            yield this.repository.deleteLesson(lessonId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lessonId, resourceId } = id;
            const lesson = yield this.repository.getLessonById(lessonId, resourceId);
            if (!lesson) {
                if (error) {
                    throw error;
                }
            }
            return lesson;
        });
    }
};
exports.CourseLessonService = CourseLessonService;
__decorate([
    (0, inversify_1.inject)(lesson_type_1.CourseLessonDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseLessonService.prototype, "repository", void 0);
exports.CourseLessonService = CourseLessonService = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonService);
