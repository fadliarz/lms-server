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
require("reflect-metadata");
const inversify_1 = require("inversify");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
let CourseRepository = class CourseRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    createCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.course.create({
                data,
            });
        });
    }
    getCourses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.course.findMany(query
                ? {
                    skip: query.pageNumber && query.pageSize
                        ? (query.pageNumber - 1) * query.pageSize
                        : 0,
                    take: query.pageSize || 0,
                    include: {
                        author: !!query.include_author
                            ? {
                                select: {
                                    id: true,
                                    avatar: true,
                                    name: true,
                                    NIM: true,
                                },
                            }
                            : false,
                        category: !!query.include_category,
                    },
                }
                : undefined);
        });
    }
    getCourseById(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.course.findUnique({
                where: { id: id.courseId },
                include: query
                    ? {
                        author: query.include_author
                            ? {
                                select: {
                                    id: true,
                                    avatar: true,
                                    name: true,
                                    NIM: true,
                                },
                            }
                            : false,
                        category: !!query.include_category,
                        lessons: !!query.include_lessons
                            ? !!query.include_public_videos
                                ? {
                                    select: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        totalVideos: true,
                                        totalMaterials: true,
                                        videos: {
                                            select: {
                                                id: true,
                                                name: true,
                                                description: true,
                                                totalDurations: true,
                                            },
                                        },
                                    },
                                }
                                : {
                                    select: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        totalVideos: true,
                                        totalMaterials: true,
                                    },
                                }
                            : false,
                    }
                    : undefined,
            });
        });
    }
    getCourseByIdOrThrow(id, query, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.getCourseById(id, query);
            if (!course) {
                throw error || new RecordNotFoundException_1.default();
            }
            return course;
        });
    }
    updateCourse(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.course.update({ where: { id: id.courseId }, data });
        });
    }
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.course.delete({
                where: {
                    id: id.courseId,
                },
            });
        });
    }
    createLike(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseLike.create({
                data: Object.assign(Object.assign({}, data), { courseId: id.courseId }),
            });
        });
    }
    getLikeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likeId, resourceId } = id;
            return this.db.courseLike.findFirst({
                where: resourceId
                    ? { id: likeId, courseId: resourceId.courseId }
                    : { id: likeId },
            });
        });
    }
    getLikeByIdOrThrow(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.getLikeById(id);
            if (!like) {
                throw error || new RecordNotFoundException_1.default();
            }
            return like;
        });
    }
    deleteLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likeId, resourceId } = id;
            const where = resourceId
                ? {
                    id: likeId,
                    courseId: resourceId.courseId,
                }
                : { id: likeId };
            return this.db.courseLike.delete({
                where,
            });
        });
    }
    getCourseAuthorByIdOrThrow(id, options, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.db.course.findUnique({
                where: {
                    id: id.courseId,
                },
                select: {
                    author: options && options.minimalist ? { select: { id: true } } : true,
                },
            });
            if (!course) {
                throw error || new RecordNotFoundException_1.default();
            }
            return course.author;
        });
    }
};
CourseRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CourseRepository);
exports.default = CourseRepository;
