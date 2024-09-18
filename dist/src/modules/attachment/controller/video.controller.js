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
const video_type_1 = require("../video.type");
const statusCode_1 = require("../../../common/constants/statusCode");
const isNaNArray_1 = __importDefault(require("../../../common/functions/isNaNArray"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const video_joi_1 = require("./video.joi");
const getPagingQuery_1 = __importDefault(require("../../../common/functions/getPagingQuery"));
let CourseLessonVideoController = class CourseLessonVideoController {
    createVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: video_joi_1.CreateCourseLessonVideoDtoJoi })(req, res, next);
                const newVideo = yield this.service.createVideo((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { resourceId: this.validateResourceId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({ data: newVideo });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getVideos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ query: video_joi_1.GetCourseLessonVideosQueryJoi })(req, res, next);
                const videos = yield this.service.getVideos((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { resourceId: this.validateResourceId(req) }, (0, getPagingQuery_1.default)(req.query));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: videos });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getVideoById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const video = yield this.service.getVideoById((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    videoId: this.validateVideoId(req),
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: video });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: video_joi_1.UpdateCourseLessonVideoDtoJoi })(req, res, next);
                const updatedVideo = yield this.service.updateVideo((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    videoId: this.validateVideoId(req),
                    resourceId: this.validateResourceId(req),
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedVideo });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateVideoSource(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: video_joi_1.UpdateCourseLessonVideoSourceDtoJoi })(req, res, next);
                const updatedVideo = yield this.service.updateVideoSource((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    videoId: this.validateVideoId(req),
                    resourceId: this.validateResourceId(req),
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedVideo });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteVideo((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    videoId: this.validateVideoId(req),
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.lessonId);
        if ((0, isNaNArray_1.default)([courseId, lessonId])) {
            throw new NaNException_1.default("courseId || lessonId");
        }
        return {
            courseId,
            lessonId,
        };
    }
    validateVideoId(req) {
        const videoId = Number(req.params.videoId);
        if (isNaN(videoId)) {
            throw new NaNException_1.default("videoId");
        }
        return videoId;
    }
};
__decorate([
    (0, inversify_1.inject)(video_type_1.CourseLessonVideoDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseLessonVideoController.prototype, "service", void 0);
CourseLessonVideoController = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonVideoController);
exports.default = CourseLessonVideoController;
