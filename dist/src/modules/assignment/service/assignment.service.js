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
const assignment_type_1 = require("../assignment.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const repository_type_1 = require("../../../common/class/repository/repository.type");
let CourseClassAssignmentService = class CourseClassAssignmentService {
    createAssignment(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.createAssignment(resourceId, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    foreignConstraint: {
                        default: { message: "Class doesn't exist!" },
                    },
                });
            }
        });
    }
    getAssignmentById(assignmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { assignment } = yield this.validateRelationBetweenResources({
                assignmentId,
                resourceId,
            });
            return assignment;
        });
    }
    getAssignments(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ resourceId });
            return yield this.repository.getAssignments(resourceId);
        });
    }
    updateAssignment(assignmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ assignmentId, resourceId });
            return yield this.repository.updateAssignment(assignmentId, resourceId, dto);
        });
    }
    deleteAssignment(assignmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources({ assignmentId, resourceId });
            yield this.repository.deleteAssignment(assignmentId, resourceId);
            return {};
        });
    }
    validateRelationBetweenResources(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { resourceId } = id;
            const { courseId, classId } = resourceId;
            const theClass = yield this.globalRepository.courseClass.getClassById(classId, resourceId);
            if (!theClass || theClass.courseId !== courseId) {
                throw new RecordNotFoundException_1.default("class doesn't exist!");
            }
            if (id.assignmentId) {
                const { assignmentId } = id;
                const assignment = yield this.globalRepository.courseClassAssignment.getAssignmentById(assignmentId, resourceId);
                if (!assignment || assignment.classId !== classId) {
                    throw new RecordNotFoundException_1.default("assignment doesn't exist!");
                }
                if (assignmentId) {
                    return {
                        class: theClass,
                        assignment,
                    };
                }
            }
            return { class: theClass };
        });
    }
};
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], CourseClassAssignmentService.prototype, "globalRepository", void 0);
__decorate([
    (0, inversify_1.inject)(assignment_type_1.CourseClassAssignmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], CourseClassAssignmentService.prototype, "repository", void 0);
CourseClassAssignmentService = __decorate([
    (0, inversify_1.injectable)()
], CourseClassAssignmentService);
exports.default = CourseClassAssignmentService;
