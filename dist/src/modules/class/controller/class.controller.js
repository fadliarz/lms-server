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
const inversify_1 = require("inversify");
const class_type_1 = require("../class.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const removeNullFields_1 = __importDefault(require("../../../common/functions/removeNullFields"));
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const class_joi_1 = require("./class.joi");
let CourseClassController = class CourseClassController {
    createClass(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: class_joi_1.CreateCourseClassDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newClass = yield this.service.createClass(resourceId, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: (0, removeNullFields_1.default)(newClass),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getClassById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classId = this.validateClassId(req);
                const resourceId = this.validateUnauthenticatedResourceId(req);
                const theClass = yield this.service.getClassById(classId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: (0, removeNullFields_1.default)(theClass),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getClasses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceId = this.validateUnauthenticatedResourceId(req);
                const classes = yield this.service.getClasses(resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: classes.map((theClass) => (0, removeNullFields_1.default)(theClass)),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateClass(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: class_joi_1.UpdateCourseClassDtoJoi })(req, res, next);
                const classId = this.validateClassId(req);
                const resourceId = this.validateResourceId(req);
                const updatedClass = yield this.service.updateClass(classId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: (0, removeNullFields_1.default)(updatedClass),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteClass(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classId = this.validateClassId(req);
                const resourceId = this.validateResourceId(req);
                yield this.service.deleteClass(classId, resourceId);
                res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const { id: userId, role } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return {
            user: { id: userId, role },
            courseId,
        };
    }
    validateUnauthenticatedResourceId(req) {
        const courseId = Number(req.params.courseId);
        if (isNaN(courseId)) {
            throw new NaNException_1.default("courseId");
        }
        return {
            courseId,
        };
    }
    validateClassId(req) {
        const classId = Number(req.params.classId);
        if (isNaN(classId)) {
            throw new NaNException_1.default("classId");
        }
        return classId;
    }
};
__decorate([
    (0, inversify_1.inject)(class_type_1.CourseClassDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseClassController.prototype, "service", void 0);
CourseClassController = __decorate([
    (0, inversify_1.injectable)()
], CourseClassController);
exports.default = CourseClassController;
