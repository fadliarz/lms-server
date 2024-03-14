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
exports.CourseCategoryRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const category_type_1 = require("../category.type");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const prisma_query_raw_type_1 = require("../../../common/class/prisma_query_raw/prisma_query_raw.type");
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const InternalServerException_1 = __importDefault(require("../../../common/class/exceptions/InternalServerException"));
let CourseCategoryRepository = class CourseCategoryRepository {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createCategory(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeCreateCategory);
                return yield tx.courseCategory.create({ data: dto });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield tx.courseCategory.findMany();
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield tx.courseCategory.findUnique({
                    where: { id: categoryId },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    updateCategory(categoryId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorize(tx, resourceId, this.authorization.authorizeUpdateCategory);
                yield this.prismaQueryRaw.courseCategory.selectForUpdateByIdOrThrow(tx, categoryId);
                return yield tx.courseCategory.update({
                    where: {
                        id: categoryId,
                    },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    authorize(tx, resourceId, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = resourceId;
            const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId);
            const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(user.role);
            if (!(isStudent || isInstructor || isAdmin)) {
                throw new InternalServerException_1.default();
            }
            fn(user);
            return {
                user,
            };
        });
    }
};
exports.CourseCategoryRepository = CourseCategoryRepository;
__decorate([
    (0, inversify_1.inject)(category_type_1.CourseCategoryDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseCategoryRepository.prototype, "authorization", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], CourseCategoryRepository.prototype, "prismaQueryRaw", void 0);
exports.CourseCategoryRepository = CourseCategoryRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseCategoryRepository);
