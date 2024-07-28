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
exports.UserService = void 0;
require("reflect-metadata");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const encrypt_1 = __importDefault(require("../../../utils/encrypt"));
const user_type_1 = require("../user.type");
const inversify_1 = require("inversify");
const validateEnv_1 = __importDefault(require("../../../common/functions/validateEnv"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const Cookie_1 = require("../../../common/constants/Cookie");
const AuthenticationException_1 = __importDefault(require("../../../common/class/exceptions/AuthenticationException"));
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const prisma_query_raw_type_1 = require("../../../common/class/prisma_query_raw/prisma_query_raw.type");
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
const LocalStorageKey_1 = require("../../../common/constants/LocalStorageKey");
const isEqualOrIncludeRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeRole"));
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const course_type_1 = require("../../course/course.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
let UserService = class UserService {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                dto.email = dto.email.toLowerCase();
                const { email, password } = dto;
                const accessToken = this.generateFreshAuthenticationToken(Cookie_1.Cookie.ACCESS_TOKEN, email);
                const refreshToken = this.generateFreshAuthenticationToken(Cookie_1.Cookie.REFRESH_TOKEN, email);
                dto.password = (0, encrypt_1.default)(password);
                const newUser = yield this.repository.createUser(dto, accessToken, [
                    refreshToken,
                ]);
                return newUser;
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    uniqueConstraint: {
                        email: {
                            message: "email is already taken!",
                        },
                        nim: {
                            message: "NIM is already taken!",
                        },
                        default: {
                            message: "unique constraint failed!",
                        },
                    },
                });
            }
        });
    }
    getPublicUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repository.getUserById(userId);
            if (!user) {
                throw new RecordNotFoundException_1.default();
            }
            return {
                id: user.id,
                name: user.name,
                NIM: user.NIM,
                avatar: user.avatar,
                about: user.about,
                role: user.role,
            };
        });
    }
    getMe(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = yield this.repository.getUserByIdOrThrow(userId);
            me.accessToken = null;
            me.refreshToken = [];
            return me;
        });
    }
    getUserAssignments(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                this.authorization.authorizeGetUserAssignments(user, targetUserId);
                return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return this.repository.getUserAssignments(userId);
                }));
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    updateBasicUser(userId, targetUserId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                this.authorization.authorizeUpdateUser(user, targetUserId);
                return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return this.repository.updateUser(targetUserId, dto);
                }));
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    updateUserEmail(userId, targetUserId, storedRefreshToken, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    dto.email = dto.email.toLowerCase();
                    const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                    this.authorization.authorizeUpdateUser(user, targetUserId);
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return yield this.repository.updateUser(targetUserId, Object.assign(Object.assign({}, dto), { refreshToken: [storedRefreshToken] }));
                    }));
                }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    uniqueConstraint: {
                        default: {
                            message: "email is already taken!",
                        },
                    },
                });
            }
        });
    }
    updateUserPassword(userId, targetUserId, storedRefreshToken, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                this.authorization.authorizeUpdateUser(user, targetUserId);
                return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.updateUser(targetUserId, Object.assign(Object.assign({}, dto), { refreshToken: [storedRefreshToken] }));
                }));
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    updateUserPhoneNumber(userId, targetUserId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                this.authorization.authorizeUpdateUser(user, targetUserId);
                return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.updateUser(targetUserId, dto);
                }));
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    updateUserRole(userId, targetUserId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                this.authorization.authorizeUpdateUser(user, targetUserId);
                const targetUser = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, targetUserId, new RecordNotFoundException_1.default());
                const currentRole = targetUser.role;
                const { role: newRole } = dto;
                if ((0, isEqualOrIncludeRole_1.default)(currentRole, newRole)) {
                    return targetUser;
                }
                const { isStudent, isInstructor, isAdmin } = (0, getRoleStatus_1.default)(currentRole);
                if ((isStudent || isInstructor) &&
                    (0, isEqualOrIncludeRole_1.default)(newRole, course_type_1.UserRoleModel.STUDENT)) {
                    yield tx.courseEnrollment.updateMany({
                        where: {
                            userId: targetUserId,
                        },
                        data: {
                            role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                        },
                    });
                    yield tx.course.deleteMany({
                        where: {
                            authorId: targetUserId,
                        },
                    });
                }
                return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.updateUser(targetUserId, dto);
                }));
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    deleteUser(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new AuthenticationException_1.default());
                this.authorization.authorizeDeleteUser(user, targetUserId);
                yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.deleteUser(targetUserId);
                }));
                return {};
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    signInUser(req, res, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                dto.email = dto.email.toLowerCase();
                const { email, password } = dto;
                const userRelatedToSignInEmail = yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.getUserByEmail(email);
                }));
                if (!userRelatedToSignInEmail) {
                    throw new RecordNotFoundException_1.default();
                }
                const isPasswordMatch = this.verifyPassword(password, userRelatedToSignInEmail.password);
                if (!isPasswordMatch) {
                    throw new ClientException_1.default("Invalid password!");
                }
                const cookies = req.cookies;
                const accessToken = this.generateFreshAuthenticationToken(Cookie_1.Cookie.ACCESS_TOKEN, email);
                const newRefreshToken = this.generateFreshAuthenticationToken(Cookie_1.Cookie.REFRESH_TOKEN, email);
                const storedRefreshToken = cookies[Cookie_1.Cookie.REFRESH_TOKEN];
                let newRefreshTokenArray = userRelatedToSignInEmail.refreshToken;
                if (storedRefreshToken) {
                    /**
                     *
                     * Some possible scenarios:
                     *
                     * 1. User logged in before but never uses refreshToken and doesn't sign out
                     * 2. refreshToken is stolen
                     *
                     * If that's the case, then clear all refreshTokens when user signs in (reuse detection).
                     *
                     */
                    const userBelongToStoredRefreshToken = yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return yield this.repository.getUserByRefreshToken(storedRefreshToken);
                    }));
                    if (!userBelongToStoredRefreshToken) {
                        newRefreshTokenArray = [];
                    }
                    else {
                        newRefreshTokenArray = newRefreshTokenArray.filter((rt) => rt !== storedRefreshToken);
                    }
                    res.clearCookie(Cookie_1.Cookie.REFRESH_TOKEN, {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                newRefreshTokenArray = [...newRefreshTokenArray, newRefreshToken];
                yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.updateUser(userRelatedToSignInEmail.id, {
                        accessToken,
                        refreshToken: newRefreshTokenArray,
                    });
                }));
                const user = Object.assign(Object.assign({}, userRelatedToSignInEmail), { accessToken,
                    newRefreshTokenArray });
                res
                    .cookie(Cookie_1.Cookie.ACCESS_TOKEN, accessToken, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * Cookie_1.Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
                    secure: process.env.NODE_ENV === "production",
                })
                    .cookie(Cookie_1.Cookie.REFRESH_TOKEN, newRefreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * Cookie_1.Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });
                return user;
            }));
        });
    }
    signOutUser(storedRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const userRelatedToStoredRefreshToken = yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.getUserByRefreshToken(storedRefreshToken);
                }));
                if (!userRelatedToStoredRefreshToken) {
                    throw new AuthenticationException_1.default();
                }
                yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                    return yield this.repository.updateUser(userRelatedToStoredRefreshToken.id, {
                        refreshToken: userRelatedToStoredRefreshToken === null || userRelatedToStoredRefreshToken === void 0 ? void 0 : userRelatedToStoredRefreshToken.refreshToken.filter((rt) => rt !== storedRefreshToken),
                    });
                }));
            }));
        });
    }
    generateFreshAuthenticationToken(type, email) {
        const env = (0, validateEnv_1.default)();
        let privateKey = env.ACCESS_TOKEN_PRIVATE_KEY;
        let expiresIn = Math.floor(Date.now()) +
            1000 * 60 * 60 * Cookie_1.Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR;
        if (type.toString() === Cookie_1.Cookie.REFRESH_TOKEN.toString()) {
            privateKey = env.REFRESH_TOKEN_PRIVATE_KEY;
            expiresIn =
                Math.floor(Date.now()) +
                    1000 * 60 * 60 * 24 * Cookie_1.Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY;
        }
        return jsonwebtoken_1.default.sign({ email }, privateKey, {
            expiresIn,
        });
    }
    verifyPassword(password, encryptedPassword) {
        return (0, lodash_1.isEqual)((0, encrypt_1.default)(password), encryptedPassword);
    }
};
exports.UserService = UserService;
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.REPOSITORY),
    __metadata("design:type", Object)
], UserService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], UserService.prototype, "authorization", void 0);
__decorate([
    (0, inversify_1.inject)(prisma_query_raw_type_1.PrismaQueryRawDITypes.PRISMA_QUERY_RAW),
    __metadata("design:type", Object)
], UserService.prototype, "prismaQueryRaw", void 0);
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
