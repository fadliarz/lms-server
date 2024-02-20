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
exports.PrismaTableDITypes = void 0;
const inversify_1 = require("inversify");
exports.PrismaTableDITypes = {
    TABLE: Symbol.for("PRISMA_TABLE"),
    COURSE: Symbol.for("PRISMA_COURSE_TABLE"),
    COURSE_ENROLLMENT: Symbol.for("PRISMA_COURSE_ENROLLMENT_TABLE"),
    COURSE_LESSON: Symbol.for("PRISMA_COURSE_LESSON_TABLE"),
    COURSE_LESSON_VIDEO: Symbol.for("PRISMA_COURSE_LESSON_VIDEO_TABLE"),
    COURSE_LIKE: Symbol.for("PRISMA_COURSE_LIKE_TABLE"),
};
let PrismaTable = class PrismaTable {
};
__decorate([
    (0, inversify_1.inject)(exports.PrismaTableDITypes.COURSE),
    __metadata("design:type", Object)
], PrismaTable.prototype, "course", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PrismaTableDITypes.COURSE_ENROLLMENT),
    __metadata("design:type", Object)
], PrismaTable.prototype, "courseEnrollment", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PrismaTableDITypes.COURSE_LESSON),
    __metadata("design:type", Object)
], PrismaTable.prototype, "courseLesson", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PrismaTableDITypes.COURSE_LESSON_VIDEO),
    __metadata("design:type", Object)
], PrismaTable.prototype, "courseLessonVideo", void 0);
__decorate([
    (0, inversify_1.inject)(exports.PrismaTableDITypes.COURSE_LIKE),
    __metadata("design:type", Object)
], PrismaTable.prototype, "courseLike", void 0);
PrismaTable = __decorate([
    (0, inversify_1.injectable)()
], PrismaTable);
exports.default = PrismaTable;
