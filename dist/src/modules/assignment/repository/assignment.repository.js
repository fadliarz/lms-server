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
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
const getQueryExtendObject_1 = __importDefault(require("../../../common/functions/getQueryExtendObject"));
let CourseClassAssignmentRepository = class CourseClassAssignmentRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    createAssignment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.resourceId) {
                const theClass = yield this.db.courseClass.findFirst({
                    where: {
                        id: id.classId,
                        course: {
                            id: id.resourceId.courseId,
                        },
                    },
                    select: { id: true },
                });
                if (!theClass) {
                    throw new RecordNotFoundException_1.default();
                }
            }
            return this.db.courseClassAssignment.create({
                data: Object.assign(Object.assign({}, data), { classId: id.classId }),
            });
        });
    }
    getAssignments(id, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseClassAssignment.findMany(Object.assign({ where: this.getWhereObjectForFirstLevelOperation(id) }, (0, getQueryExtendObject_1.default)(query)));
        });
    }
    getAssignmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseClassAssignment.findFirst({
                where: this.getWhereObjectForSecondLevelOperation(id),
            });
        });
    }
    getAssignmentByIdOrThrow(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield this.getAssignmentById(id);
            if (!assignment) {
                throw error || new RecordNotFoundException_1.default();
            }
            return assignment;
        });
    }
    updateAssignment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseClassAssignment.update({
                where: this.getWhereObjectForSecondLevelOperation(id),
                data,
            });
        });
    }
    deleteAssignment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseClassAssignment.delete({
                where: this.getWhereObjectForSecondLevelOperation(id),
            });
        });
    }
    getWhereObjectForFirstLevelOperation(id) {
        if (id.resourceId) {
            return {
                courseClass: {
                    id: id.classId,
                    course: {
                        id: id.resourceId.courseId,
                    },
                },
            };
        }
        return {
            courseClass: { id: id.classId },
        };
    }
    getWhereObjectForSecondLevelOperation(id) {
        const { assignmentId, resourceId } = id;
        if (resourceId) {
            return {
                id: assignmentId,
                courseClass: {
                    id: resourceId.classId,
                    course: { id: resourceId.courseId },
                },
            };
        }
        return { id: assignmentId };
    }
};
CourseClassAssignmentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CourseClassAssignmentRepository);
exports.default = CourseClassAssignmentRepository;
