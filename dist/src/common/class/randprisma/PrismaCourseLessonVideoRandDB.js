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
const RandDBUtil_1 = __importDefault(require("./RandDBUtil"));
const rand_type_1 = require("./rand.type");
const getValuable_1 = __importDefault(require("../../functions/getValuable"));
const PrismaClientSingleton_1 = __importDefault(require("../PrismaClientSingleton"));
const inversify_1 = require("inversify");
class PrismaCourseLessonVideoRandDB extends RandDBUtil_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    generateOne(authorUserRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const resources = yield this.courseLesson.generateOne(authorUserRole);
            const video = yield this.prisma.courseLessonVideo.create({
                data: Object.assign(Object.assign({}, this.generateDto()), { lessonId: resources.lesson.id }),
            });
            yield this.prisma.course.update({
                where: {
                    id: resources.course.id,
                },
                data: {
                    totalVideos: 1,
                    totalDurations: video.totalDurations,
                },
            });
            resources.course.totalVideos = 1;
            resources.course.totalDurations = video.totalDurations;
            yield this.prisma.courseLesson.update({
                where: { id: resources.lesson.id },
                data: { totalVideos: 1, totalDurations: video.totalDurations },
            });
            resources.lesson.totalVideos = 1;
            resources.lesson.totalDurations = video.totalDurations;
            return Object.assign(Object.assign({}, resources), { video: (0, getValuable_1.default)(video) });
        });
    }
    generateDto() {
        return {
            name: this.generateRandomString(8),
            description: this.generateRandomString(8),
            youtubeLink: this.generateRandomString(32),
            totalDurations: this.generateRandomInteger(5, 10),
        };
    }
}
exports.default = PrismaCourseLessonVideoRandDB;
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE_LESSON),
    __metadata("design:type", Object)
], PrismaCourseLessonVideoRandDB.prototype, "courseLesson", void 0);
