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
const class_type_1 = require("../class.type");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let CourseClassRepository = class CourseClassRepository extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createClass(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeCreateClass.bind(this.authorization));
                const { courseId } = resourceId;
                return yield tx.courseClass.create({
                    data: Object.assign(Object.assign({}, dto), { courseId }),
                });
            }));
        });
    }
    getClassById(classId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield tx.courseClass.findUnique({
                    where: {
                        id: classId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getClassByIdOrThrow(classId, resourceId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.getClassById(classId, resourceId);
            if (!lesson) {
                throw error || new RecordNotFoundException_1.default();
            }
            return lesson;
        });
    }
    getClasses(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const { courseId } = resourceId;
                return yield tx.courseClass.findMany({
                    where: {
                        courseId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    updateClass(classId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeUpdateClass.bind(this.authorization));
                return yield tx.courseClass.update({
                    where: {
                        id: classId,
                    },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    deleteClass(classId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeDeleteClass.bind(this.authorization));
                yield tx.courseClass.delete({
                    where: {
                        id: classId,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            return {};
        });
    }
};
__decorate([
    (0, inversify_1.inject)(class_type_1.CourseClassDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseClassRepository.prototype, "authorization", void 0);
CourseClassRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseClassRepository);
exports.default = CourseClassRepository;
