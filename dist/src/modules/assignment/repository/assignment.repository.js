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
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const assignment_type_1 = require("../assignment.type");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let CourseClassAssignmentRepository = class CourseClassAssignmentRepository extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createAssignment(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeCreateAssignment.bind(this.authorization));
                const { classId } = resourceId;
                return tx.courseClassAssignment.create({
                    data: Object.assign(Object.assign({}, dto), { classId }),
                });
            }));
        });
    }
    getAssignmentById(assignmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeReadAssignment.bind(this.authorization));
                return yield tx.courseClassAssignment.findUnique({
                    where: {
                        id: assignmentId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getAssignmentByIdOrThrow(assignmentId, resourceId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const assignment = yield this.getAssignmentById(assignmentId, resourceId);
            if (!assignment) {
                throw error || new RecordNotFoundException_1.default();
            }
            return assignment;
        });
    }
    getAssignments(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeReadAssignment.bind(this.authorization));
                const { classId } = resourceId;
                return yield tx.courseClassAssignment.findMany({
                    where: {
                        classId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    updateAssignment(assignmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeUpdateAssignment.bind(this.authorization));
                return yield tx.courseClassAssignment.update({
                    where: {
                        id: assignmentId,
                    },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    deleteAssignment(assignmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeDeleteAssignment.bind(this.authorization));
                yield tx.courseClassAssignment.delete({
                    where: {
                        id: assignmentId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            return {};
        });
    }
};
__decorate([
    (0, inversify_1.inject)(assignment_type_1.CourseClassAssignmentDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseClassAssignmentRepository.prototype, "authorization", void 0);
CourseClassAssignmentRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseClassAssignmentRepository);
exports.default = CourseClassAssignmentRepository;
