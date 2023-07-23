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
exports.CourseController = void 0;
const inversify_1 = require("inversify");
const course_type_1 = require("../course.type");
const statusCode_1 = require("../../../common/constants/statusCode");
const getRequestUser_1 = require("../../../common/functions/getRequestUser");
const handleError_1 = require("../../../common/exceptions/handleError");
let CourseController = exports.CourseController = class CourseController {
    createCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (0, getRequestUser_1.getRequestUser)(req);
                const course = yield this.courseService.createCourse(user.id, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json(course);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, next);
            }
        });
    }
    updateCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (0, getRequestUser_1.getRequestUser)(req);
                const course = yield this.courseService.updateCourse(user.id, req.params.courseId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json(course);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, next);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.COURSE_SERVICE),
    __metadata("design:type", Object)
], CourseController.prototype, "courseService", void 0);
exports.CourseController = CourseController = __decorate([
    (0, inversify_1.injectable)()
], CourseController);
