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
const prisma_query_raw_type_1 = require("./prisma_query_raw.type");
const inversify_1 = require("inversify");
let PrismaQueryRaw = class PrismaQueryRaw {
};
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.USER),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "user", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "course", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_CATEGORY),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "courseCategory", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_ENROLLMENT),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "courseEnrollment", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_LESSON),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "courseLesson", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_LESSON_VIDEO),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "courseLessonVideo", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.DEPARTMENT),
    __metadata("design:type", Object)
], PrismaQueryRaw.prototype, "department", void 0);
PrismaQueryRaw = __decorate([
    (0, inversify_1.injectable)()
], PrismaQueryRaw);
exports.default = PrismaQueryRaw;
