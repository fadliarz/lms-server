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
const rand_type_1 = require("./rand.type");
let PrismaRandDB = class PrismaRandDB {
};
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.USER),
    __metadata("design:type", Object)
], PrismaRandDB.prototype, "user", void 0);
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE),
    __metadata("design:type", Object)
], PrismaRandDB.prototype, "course", void 0);
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE_CATEGORY),
    __metadata("design:type", Object)
], PrismaRandDB.prototype, "courseCategory", void 0);
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE_ENROLLMENT),
    __metadata("design:type", Object)
], PrismaRandDB.prototype, "courseEnrollment", void 0);
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE_LESSON),
    __metadata("design:type", Object)
], PrismaRandDB.prototype, "courseLesson", void 0);
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE_LESSON_VIDEO),
    __metadata("design:type", Object)
], PrismaRandDB.prototype, "courseLessonVideo", void 0);
PrismaRandDB = __decorate([
    (0, inversify_1.injectable)()
], PrismaRandDB);
exports.default = PrismaRandDB;
