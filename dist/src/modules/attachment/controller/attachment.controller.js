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
const statusCode_1 = require("../../../common/constants/statusCode");
const isNaNArray_1 = __importDefault(require("../../../common/functions/isNaNArray"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const getPagingQuery_1 = __importDefault(require("../../../common/functions/getPagingQuery"));
const attachment_type_1 = require("../attachment.type");
const attachment_joi_1 = require("./attachment.joi");
let CourseLessonAttachmentController = class CourseLessonAttachmentController {
    createAttachment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: attachment_joi_1.CreateCourseLessonAttachmentDtoJoi })(req, res, next);
                const newAttachment = yield this.service.createAttachment((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { resourceId: this.validateResourceId(req) }, req.body);
                return res
                    .status(statusCode_1.StatusCode.RESOURCE_CREATED)
                    .json({ data: newAttachment });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAttachments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ query: attachment_joi_1.GetCourseLessonAttachmentsQueryJoi })(req, res, next);
                const attachments = yield this.service.getAttachments((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { resourceId: this.validateResourceId(req) }, (0, getPagingQuery_1.default)(req.query));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: attachments });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAttachmentById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attachment = yield this.service.getAttachmentById((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    attachmentId: this.validateAttachmentId(req),
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: attachment });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateAttachment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: attachment_joi_1.UpdateCourseLessonAttachmentDtoJoi })(req, res, next);
                const updatedAttachment = yield this.service.updateAttachment((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    attachmentId: this.validateAttachmentId(req),
                    resourceId: this.validateResourceId(req),
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedAttachment });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteAttachment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteAttachment((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    attachmentId: this.validateAttachmentId(req),
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const courseId = Number(req.params.courseId);
        const lessonId = Number(req.params.lessonId);
        if ((0, isNaNArray_1.default)([courseId, lessonId])) {
            throw new NaNException_1.default("courseId || lessonId");
        }
        return {
            courseId,
            lessonId,
        };
    }
    validateAttachmentId(req) {
        const attachmentId = Number(req.params.attachmentId);
        if (isNaN(attachmentId)) {
            throw new NaNException_1.default("attachmentId");
        }
        return attachmentId;
    }
};
__decorate([
    (0, inversify_1.inject)(attachment_type_1.CourseLessonAttachmentDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseLessonAttachmentController.prototype, "service", void 0);
CourseLessonAttachmentController = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonAttachmentController);
exports.default = CourseLessonAttachmentController;
