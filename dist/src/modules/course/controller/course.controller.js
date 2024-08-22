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
const course_type_1 = require("../course.type");
const statusCode_1 = require("../../../common/constants/statusCode");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const course_joi_1 = require("./course.joi");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const convertStringToBoolean_1 = __importDefault(require("../../../common/functions/convertStringToBoolean"));
let CourseController = class CourseController {
    createCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: course_joi_1.CreateCourseDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newCourse = yield this.service.createCourse({ resourceId }, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({ data: newCourse });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ query: course_joi_1.GetCoursesQueryJoi })(req, res, next);
                const reqQuery = req.query;
                const query = {
                    include_category: (0, convertStringToBoolean_1.default)(reqQuery.include_category),
                    pageSize: !isNaN(reqQuery.pageSize)
                        ? Number(reqQuery.pageSize)
                        : undefined,
                    pageNumber: !isNaN(reqQuery.pageNumber)
                        ? Number(reqQuery.pageNumber)
                        : undefined,
                };
                const courses = yield this.service.getCourses(query);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: courses });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCourseById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ query: course_joi_1.GetCourseByIdQueryJoi })(req, res, next);
                const courseId = this.validateCourseId(req);
                const reqQuery = req.query;
                const query = {
                    include_category: (0, convertStringToBoolean_1.default)(reqQuery.include_category),
                    include_lessons: (0, convertStringToBoolean_1.default)(reqQuery.include_lessons),
                    include_public_videos: (0, convertStringToBoolean_1.default)(reqQuery.include_public_videos),
                };
                const course = yield this.service.getCourseById({ courseId }, query);
                res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: course,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: course_joi_1.UpdateCourseDtoJoi })(req, res, next);
                const courseId = this.validateCourseId(req);
                const resourceId = this.validateResourceId(req);
                const updatedCourse = yield this.service.updateCourse({
                    courseId,
                    resourceId,
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedCourse });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCourseStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: course_joi_1.UpdateCourseStatusDtoJoi })(req, res, next);
                const courseId = this.validateCourseId(req);
                const resourceId = this.validateResourceId(req);
                const updatedCourse = yield this.service.updateCourseStatus({
                    courseId,
                    resourceId,
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedCourse });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCourseCategoryId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: course_joi_1.UpdateCourseCategoryIdDtoJoi })(req, res, next);
                const courseId = this.validateCourseId(req);
                const resourceId = this.validateResourceId(req);
                const updatedCourse = yield this.service.updateCourseCategoryId({
                    courseId,
                    resourceId,
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedCourse });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCourseCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: course_joi_1.UpdateCourseCodeDtoJoi })(req, res, next);
                const courseId = this.validateCourseId(req);
                const resourceId = this.validateResourceId(req);
                const updatedCourse = yield this.service.updateCourseCode({
                    courseId,
                    resourceId,
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedCourse });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = this.validateCourseId(req);
                const resourceId = this.validateResourceId(req);
                yield this.service.deleteCourse({ courseId, resourceId });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: course_joi_1.CreateCourseLikeDtoJoi })(req, res, next);
                const resourceId = this.validateLikeResourceId(req);
                const newLike = yield this.service.createLike({ resourceId });
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({ data: newLike });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const likeId = this.validateLikeId(req);
                const resourceId = this.validateLikeResourceId(req);
                yield this.service.deleteLike({ likeId, resourceId });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req, error) {
        const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        return {
            user,
        };
    }
    validateLikeResourceId(req) {
        const user = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return {
            user,
            params: { courseId },
        };
    }
    validateCourseId(req) {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return courseId;
    }
    validateLikeId(req) {
        const likeId = Number(req.params.likeId);
        if (isNaN(likeId)) {
            throw new NaNException_1.default("likeId");
        }
        return likeId;
    }
};
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseController.prototype, "service", void 0);
CourseController = __decorate([
    (0, inversify_1.injectable)()
], CourseController);
exports.default = CourseController;
