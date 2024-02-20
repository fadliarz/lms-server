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
exports.UserRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const getValuable_1 = __importDefault(require("../../../common/functions/getValuable"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const prisma_query_raw_type_1 = require("../../../common/class/prisma_query_raw/prisma_query_raw.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let UserRepository = class UserRepository {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
        this.userTable = this.prisma.user;
    }
    createUser(dto, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.userTable.create({
                data: Object.assign(Object.assign({}, dto), { accessToken, refreshToken }),
            });
            return newUser;
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return tx.user.findUnique({ where: { id: userId } });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getUserByIdOrThrow(userId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(userId);
            if (!user) {
                throw error || new RecordNotFoundException_1.default();
            }
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return tx.user.findUnique({ where: { email } });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userTable.findFirst({
                where: {
                    refreshToken: { has: refreshToken },
                },
            });
        });
    }
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.userTable.findUniqueOrThrow({
                where: {
                    id: userId,
                },
                include: {
                    courseEnrollments: {
                        select: {
                            course: {
                                select: {
                                    id: true,
                                    totalLessons: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    title: true,
                                    description: true,
                                    totalStudents: true,
                                    totalLikes: true,
                                },
                            },
                        },
                    },
                },
            }), { courseEnrollments } = _a, user = __rest(_a, ["courseEnrollments"]);
            const me = Object.assign(Object.assign({}, (0, getValuable_1.default)(user)), { courses: courseEnrollments.map((enrollments) => {
                    return enrollments.course;
                }) });
            return me;
        });
    }
    updateUser(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId);
                return yield tx.user.update({
                    where: {
                        id: userId,
                    },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    updateUserPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.userTable.update({
                where: {
                    id: userId,
                },
                data: {
                    password,
                },
            });
            return updatedUser;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userTable.delete({
                where: {
                    id: userId,
                },
            });
        });
    }
};
exports.UserRepository = UserRepository;
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], UserRepository.prototype, "prismaQueryRaw", void 0);
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
