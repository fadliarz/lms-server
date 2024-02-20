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
exports.CourseLessonVideoRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const video_type_1 = require("../video.type");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
let CourseLessonVideoRepository = class CourseLessonVideoRepository extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createVideo(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeCreateVideo.bind(this.authorization));
                const { lessonId } = resourceId;
                return yield tx.courseLessonVideo.create({
                    data: Object.assign(Object.assign({}, dto), { lessonId }),
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    getVideoById(videoId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeGetVideo.bind(this.authorization));
                return yield tx.courseLessonVideo.findUnique({
                    where: {
                        id: videoId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getVideoByIdOrThrow(videoId, resourceId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const video = yield this.getVideoById(videoId, resourceId);
            if (!video) {
                throw error || new RecordNotFoundException_1.default();
            }
            return video;
        });
    }
    updateVideoSource(videoId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId, lessonId } = resourceId;
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeUpdateVideo.bind(this.authorization));
                return yield tx.courseLessonVideo.update({
                    where: { id: videoId },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    deleteVideo(videoId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeUpdateVideo.bind(this.authorization));
                yield tx.courseLessonVideo.delete({
                    where: {
                        id: videoId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            return {};
        });
    }
};
exports.CourseLessonVideoRepository = CourseLessonVideoRepository;
__decorate([
    (0, inversify_1.inject)(video_type_1.CourseLessonVideoDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseLessonVideoRepository.prototype, "authorization", void 0);
exports.CourseLessonVideoRepository = CourseLessonVideoRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonVideoRepository);
