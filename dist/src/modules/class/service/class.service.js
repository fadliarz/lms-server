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
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let CourseClassService = class CourseClassService {
    createClass(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createClass(resourceId, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    foreignConstraint: {
                        default: { message: "Course doesn't exist!" },
                    },
                });
            }
        });
    }
    getClassById(classId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const theClass = yield this.validateRelationBetweenResources({
                classId,
                resourceId,
            });
            return theClass;
        });
    }
    getClasses(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getClasses(resourceId);
        });
    }
    updateClass(classId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ classId, resourceId });
            return yield this.repository.updateClass(classId, resourceId, dto);
        });
    }
    deleteClass(classId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ classId, resourceId });
            yield this.repository.deleteClass(classId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { classId, resourceId } = id;
            const { courseId } = resourceId;
            const theClass = yield this.repository.getClassById(classId, resourceId);
            if (!theClass || theClass.courseId !== courseId) {
                throw new RecordNotFoundException_1.default();
            }
            return theClass;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(class_type_1.CourseClassDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseClassService.prototype, "repository", void 0);
CourseClassService = __decorate([
    (0, inversify_1.injectable)()
], CourseClassService);
exports.default = CourseClassService;
