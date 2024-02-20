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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const user_type_1 = require("../../../modules/user/user.type");
const course_type_1 = require("../../../modules/course/course.type");
const enrollment_type_1 = require("../../../modules/enrollment/enrollment.type");
const category_type_1 = require("../../../modules/category/category.type");
const lesson_type_1 = require("../../../modules/lesson/lesson.type");
const video_type_1 = require("../../../modules/video/video.type");
let Repository = class Repository {
};
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "user", void 0);
__decorate([
    (0, inversify_1.inject)(category_type_1.CourseCategoryDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseCategory", void 0);
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseEnrollment", void 0);
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "course", void 0);
__decorate([
    (0, inversify_1.inject)(lesson_type_1.CourseLessonDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseLesson", void 0);
__decorate([
    (0, inversify_1.inject)(video_type_1.CourseLessonVideoDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseLessonVideo", void 0);
Repository = __decorate([
    (0, inversify_1.injectable)()
], Repository);
exports.default = Repository;
