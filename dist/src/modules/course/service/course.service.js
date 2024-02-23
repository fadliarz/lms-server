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
exports.CourseService = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const course_type_1 = require("../course.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let CourseService = class CourseService {
    createCourse(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createCourse(resourceId, dto);
        });
    }
    getCourseById(courseId, resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getCourseByIdOrThrow(courseId, resourceId, query, new RecordNotFoundException_1.default());
        });
    }
    getCourses(resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getCourses(resourceId, query);
        });
    }
    getEnrolledCourses(resourceId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getEnrolledCourses(resourceId, query);
        });
    }
    updateBasicCourse(courseId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.updateBasicCourse(courseId, resourceId, dto);
        });
    }
    deleteCourse(courseId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.deleteCourse(courseId, resourceId);
            return {};
        });
    }
    createLike(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.createLike(resourceId);
        });
    }
    deleteLike(likeId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({
                likeId,
                resourceId,
            }, new RecordNotFoundException_1.default());
            yield this.repository.deleteLike(likeId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const { likeId, resourceId } = id;
            const { courseId } = resourceId;
            const like = yield this.repository.getLikeById(likeId, resourceId);
            if (!like || like.courseId !== courseId) {
                if (error) {
                    throw error;
                }
                return null;
            }
            return like;
        });
    }
};
exports.CourseService = CourseService;
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseService.prototype, "repository", void 0);
exports.CourseService = CourseService = __decorate([
    (0, inversify_1.injectable)()
], CourseService);
