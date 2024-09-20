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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const attachment_type_1 = require("../attachment.type");
let CourseLessonAttachmentService = class CourseLessonAttachmentService {
    createAttachment(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeCreateAttachment(user, id.resourceId.courseId);
                const _a = id.resourceId, { lessonId } = _a, theResourceId = __rest(_a, ["lessonId"]);
                return yield this.repository.createAttachment({ lessonId, resourceId: theResourceId }, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getAttachments(user, id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeReadAttachment(user, id.resourceId.courseId);
                const _a = id.resourceId, { lessonId } = _a, theResourceId = __rest(_a, ["lessonId"]);
                return yield this.repository.getAttachments({
                    lessonId,
                    resourceId: theResourceId,
                }, query);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getAttachmentById(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeReadAttachment(user, id.resourceId.courseId);
                return yield this.repository.getAttachmentByIdOrThrow(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateAttachment(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateAttachment(user, id.resourceId.courseId);
                return yield this.repository.updateAttachment(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteAttachment(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeDeleteAttachment(user, id.resourceId.courseId);
                return yield this.repository.deleteAttachment(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(attachment_type_1.CourseLessonAttachmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseLessonAttachmentService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(attachment_type_1.CourseLessonAttachmentDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseLessonAttachmentService.prototype, "authorization", void 0);
CourseLessonAttachmentService = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonAttachmentService);
exports.default = CourseLessonAttachmentService;