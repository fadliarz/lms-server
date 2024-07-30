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
const course_type_1 = require("../course.type");
const inversify_1 = require("inversify");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
const prisma_query_raw_type_1 = require("../../../common/class/prisma_query_raw/prisma_query_raw.type");
let CourseRepository = class CourseRepository extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createCourse(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorizeUserRole(tx, resourceId, this.authorization.authorizeCreateCourse.bind(this.authorization));
                const { user: { id: userId }, } = resourceId;
                const newCourse = yield tx.course.create({
                    data: Object.assign(Object.assign({}, dto), { authorId: userId }),
                });
                return newCourse;
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    getCourseById(courseId, resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { include_author, include_category, include_lessons, include_public_videos, } = query;
                return tx.course.findUnique({
                    where: { id: courseId },
                    include: {
                        author: include_author
                            ? {
                                select: {
                                    id: true,
                                    name: true,
                                    NIM: true,
                                    avatar: true,
                                    about: true,
                                    role: true,
                                },
                            }
                            : false,
                        category: include_category ? true : false,
                        lessons: include_lessons
                            ? {
                                include: {
                                    videos: include_public_videos
                                        ? {
                                            select: {
                                                id: true,
                                                name: true,
                                                description: true,
                                                totalDurations: true,
                                                createdAt: true,
                                                updatedAt: true,
                                                lessonId: true,
                                            },
                                        }
                                        : false,
                                },
                            }
                            : false,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getCourseByIdOrThrow(courseId, resourceId, query, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.getCourseById(courseId, resourceId, query);
            if (!course) {
                throw error || new RecordNotFoundException_1.default();
            }
            return course;
        });
    }
    getCourses(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { include_author, include_category, pageNumber, pageSize } = query;
                return tx.course.findMany({
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    include: {
                        author: include_author
                            ? {
                                select: {
                                    id: true,
                                    name: true,
                                    NIM: true,
                                    avatar: true,
                                    about: true,
                                    role: true,
                                },
                            }
                            : false,
                        category: include_category ? true : false,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getEnrolledCourses(resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { user: { id: userId }, } = resourceId;
                const { include_author, include_category, limit_student_courses, limit_instructor_courses, role, } = query;
                const roleSet = new Set(role);
                const enrolledCourses = [];
                for (let role of roleSet) {
                    const enrollments = yield tx.courseEnrollment.findMany({
                        where: {
                            userId,
                            role: role,
                        },
                        select: {
                            course: {
                                include: {
                                    author: include_author
                                        ? {
                                            select: {
                                                id: true,
                                                name: true,
                                                NIM: true,
                                                avatar: true,
                                                about: true,
                                                role: true,
                                            },
                                        }
                                        : include_author,
                                    category: include_category ? true : false,
                                },
                            },
                            role: true,
                        },
                        take: (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(role, course_type_1.CourseEnrollmentRoleModel.STUDENT)
                            ? limit_student_courses
                            : limit_instructor_courses,
                    });
                    const courses = [];
                    enrollments.forEach((enrollment) => {
                        courses.push({ course: enrollment.course, role });
                    });
                    enrolledCourses.push(...courses);
                }
                return enrolledCourses;
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    updateCourse(courseId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, Object.assign(Object.assign({}, resourceId), { courseId }), this.authorization.authorizeUpdateBasicCourse.bind(this.authorization));
                return tx.course.update({
                    where: { id: courseId },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    deleteCourse(courseId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, {
                    user: resourceId.user,
                    courseId,
                }, this.authorization.authorizeDeleteCourse.bind(this.authorization));
                yield tx.course.delete({
                    where: {
                        id: courseId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            return {};
        });
    }
    createLike(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeCreateLike.bind(this.authorization));
                const { user: { id: userId }, courseId, } = resourceId;
                return yield tx.courseLike.create({
                    data: {
                        courseId,
                        userId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    getLikeById(likeId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield tx.courseLike.findUnique({
                    where: { id: likeId },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getLikeByIdOrThrow(likeId, resourceId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.getLikeById(likeId, resourceId);
            if (!like) {
                throw error || new RecordNotFoundException_1.default();
            }
            return like;
        });
    }
    deleteLike(likeId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { user: { role }, } = yield this.authorize(tx, resourceId, this.authorization.authorizeDeleteLike.bind(this.authorization));
                try {
                    yield tx.courseLike.delete({
                        where: {
                            id: likeId,
                        },
                        select: {
                            id: true,
                        },
                    });
                }
                catch (error) {
                    console.log(error);
                    throw error;
                }
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            return {};
        });
    }
};
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseRepository.prototype, "authorization", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], CourseRepository.prototype, "prismaQueryRaw", void 0);
CourseRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseRepository);
exports.default = CourseRepository;
