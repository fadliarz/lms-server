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
const completion_type_1 = require("../completion.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const completion_joi_1 = require("./completion.joi");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const isNaNArray_1 = __importDefault(require("../../../common/functions/isNaNArray"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const statusCode_1 = require("../../../common/constants/statusCode");
let CourseClassAssignmentCompletionController = class CourseClassAssignmentCompletionController {
    createCompletion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: completion_joi_1.CreateCourseAssignmentCompletionDtoJoi })(req, res, next);
                const newCompletion = yield this.service.createCompletion((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    resourceId: this.validateResourceId(req),
                }, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newCompletion,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCompletion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteCompletion((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    completionId: this.validateCompletionId(req),
                    resourceId: this.validateResourceId(req),
                });
                res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const courseId = Number(req.params.courseId);
        const classId = Number(req.params.classId);
        const assignmentId = Number(req.params);
        if ((0, isNaNArray_1.default)([courseId, classId, assignmentId])) {
            throw new NaNException_1.default("courseId || classId || assignmentId");
        }
        return {
            courseId,
            classId,
            assignmentId,
        };
    }
    validateCompletionId(req) {
        const completionId = Number(req.params.completionId);
        if (isNaN(completionId)) {
            throw new NaNException_1.default("completionId");
        }
        return completionId;
    }
};
__decorate([
    (0, inversify_1.inject)(completion_type_1.CourseClassAssignmentCompletionDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseClassAssignmentCompletionController.prototype, "service", void 0);
CourseClassAssignmentCompletionController = __decorate([
    (0, inversify_1.injectable)()
], CourseClassAssignmentCompletionController);
exports.default = CourseClassAssignmentCompletionController;
