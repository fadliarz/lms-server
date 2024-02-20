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
exports.CourseLessonVideoService = void 0;
const inversify_1 = require("inversify");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const repository_type_1 = require("../../../common/class/repository/repository.type");
let CourseLessonVideoService = class CourseLessonVideoService {
    /**
     *
     * All resources existence and their relation should be checked in Repository layer while authorizing because
     * it's necessary to lock the rows while performing the features.
     *
     * So no need to implement those type of business logic in Service layer.
     *
     */
    createVideo(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ resourceId }, new RecordNotFoundException_1.default());
            return yield this.repository.courseLessonVideo.createVideo(resourceId, dto);
        });
    }
    getVideoById(videoId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.validateRelationBetweenResources({
                videoId,
                resourceId,
            });
            if (!resources) {
                throw new RecordNotFoundException_1.default();
            }
            return resources.video;
        });
    }
    updateVideoSource(videoId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ resourceId }, new RecordNotFoundException_1.default());
            return yield this.repository.courseLessonVideo.updateVideoSource(videoId, resourceId, dto);
        });
    }
    deleteVideo(videoId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.courseLessonVideo.deleteVideo(videoId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resourceId } = id;
            const { courseId, lessonId } = resourceId;
            const lesson = yield this.repository.courseLesson.getLessonById(lessonId, resourceId);
            if (!lesson || lesson.courseId !== courseId) {
                if (error) {
                    throw error;
                }
                return null;
            }
            if (id.videoId) {
                const { videoId } = id;
                const video = yield this.repository.courseLessonVideo.getVideoById(videoId, resourceId);
                if (!video || video.lessonId !== lessonId) {
                    if (error) {
                        throw error;
                    }
                    return null;
                }
                if (videoId) {
                    return {
                        lesson,
                        video,
                    };
                }
            }
            return { lesson };
        });
    }
};
exports.CourseLessonVideoService = CourseLessonVideoService;
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], CourseLessonVideoService.prototype, "repository", void 0);
exports.CourseLessonVideoService = CourseLessonVideoService = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonVideoService);
