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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const inversify_1 = require("inversify");
const course_type_1 = require("../course.type");
const getValuable_1 = require("../../../common/functions/getValuable");
let CourseService = exports.CourseService = class CourseService {
    createCourse(userId, courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseRepository.createCourse(userId, courseDetails);
                return (0, getValuable_1.getValuable)(course);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCourse(userId, courseId, courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseRepository.updateCourse(userId, courseId, courseDetails);
                return (0, getValuable_1.getValuable)(course);
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.COURSE_REPOSITORY),
    __metadata("design:type", Object)
], CourseService.prototype, "courseRepository", void 0);
exports.CourseService = CourseService = __decorate([
    (0, inversify_1.injectable)()
], CourseService);
