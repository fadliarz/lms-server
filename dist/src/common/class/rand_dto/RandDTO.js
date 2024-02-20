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
const rand_dto_type_1 = require("./rand_dto.type");
const inversify_1 = require("inversify");
let RandDTO = class RandDTO {
};
__decorate([
    (0, inversify_1.inject)(rand_dto_type_1.RandDTODITypes.USER),
    __metadata("design:type", rand_dto_type_1.IUserRandDTO)
], RandDTO.prototype, "user", void 0);
__decorate([
    (0, inversify_1.inject)(rand_dto_type_1.RandDTODITypes.COURSE),
    __metadata("design:type", rand_dto_type_1.ICourseRandDTO)
], RandDTO.prototype, "course", void 0);
__decorate([
    (0, inversify_1.inject)(rand_dto_type_1.RandDTODITypes.COURSE_LESSON),
    __metadata("design:type", rand_dto_type_1.ICourseLessonRandDTO)
], RandDTO.prototype, "courseLesson", void 0);
__decorate([
    (0, inversify_1.inject)(rand_dto_type_1.RandDTODITypes.COURSE_LESSON_VIDEO),
    __metadata("design:type", rand_dto_type_1.ICourseLessonVideoRandDTO)
], RandDTO.prototype, "courseLessonVideo", void 0);
RandDTO = __decorate([
    (0, inversify_1.injectable)()
], RandDTO);
exports.default = RandDTO;
