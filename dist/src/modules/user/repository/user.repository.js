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
exports.UserRepository = void 0;
require("reflect-metadata");
const user_type_1 = require("../user.type");
const inversify_1 = require("inversify");
const prisma_query_raw_type_1 = require("../../../common/class/prisma_query_raw/prisma_query_raw.type");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const getPrismaDb_1 = __importDefault(require("../../../common/functions/getPrismaDb"));
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
let UserRepository = class UserRepository {
    constructor() {
        this.wrapMethods();
    }
    createUser(dto, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.create({
                data: Object.assign(Object.assign({}, dto), { accessToken, refreshToken }),
            });
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findUnique({ where: { id: userId } });
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
            return this.db.user.findUnique({ where: { email } });
        });
    }
    getUserByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findFirst({
                where: {
                    accessToken,
                },
            });
        });
    }
    getUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findFirst({
                where: {
                    refreshToken: {
                        has: refreshToken,
                    },
                },
            });
        });
    }
    updateUser(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.update({
                where: { id: userId },
                data: dto,
            });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.delete({
                where: { id: userId },
            });
        });
    }
    wrapMethods() {
        const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter((name) => name !== "constructor" && typeof this[name] === "function");
        methodNames.forEach((methodName) => {
            const originalMethod = this[methodName];
            this[methodName] = (...args) => {
                this.db = (0, getPrismaDb_1.default)(asyncLocalStorage_1.default);
                return originalMethod.apply(this, args);
            };
        });
    }
};
exports.UserRepository = UserRepository;
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], UserRepository.prototype, "authorization", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], UserRepository.prototype, "prismaQueryRaw", void 0);
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
