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
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
const LocalStorageKey_1 = require("../../../common/constants/LocalStorageKey");
const isEqualOrIncludeRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeRole"));
const course_type_1 = require("../../course/course.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const repository_type_1 = require("../../../common/class/repository/repository.type");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const BaseService_1 = __importDefault(require("../../../common/class/BaseService"));
let UserService = class UserService extends BaseService_1.default {
    constructor() {
        super(...arguments);
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
                const newUser = yield this.repository.createUserAndBlankReport(Object.assign(Object.assign({}, dto), { accessToken, refreshToken: [refreshToken] }));
                return {
                    user: this.getPublicUser(newUser),
                    token: {
                        accessToken,
                        refreshToken,
                    },
                };
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {
                    uniqueConstraint: {
                        email: {
                            message: "email is already taken!",
                        },
                        default: {
                            message: "unique constraint failed!",
                        },
                    },
                });
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetUser = yield this.repository.getUserById(id);
            if (!targetUser) {
                throw new RecordNotFoundException_1.default();
            }
            return this.getPublicUser(targetUser);
        });
    }
    getMe(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPublicUser(user);
        });
    }
    getUserPermissions(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeGetUserPermissions(user, id.userId);
                return yield this.repository.getUserPermissions(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserAssignments(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeGetUserAssignments(user, id.userId);
                return yield this.repository.getUserAssignments(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserEnrolledAsStudentCourses(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeGetUserEnrolledAsStudentCourses(user, id.userId);
                return yield this.repository.getUserEnrolledCourses(id, {
                    role: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserManagedCourses(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetUserManagedCourses(user, id.userId);
                const isAcademicDivision = yield this.repository.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.COURSE);
                if (isAcademicDivision) {
                    return yield this.globalRepository.course.getCourses();
                }
                const targetUser = yield this.repository.getUserByIdOrThrow(id);
                if ((0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.ADMIN)) {
                    return yield this.globalRepository.course.getCourses();
                }
                return yield this.repository.getUserEnrolledCourses(id, {
                    role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserEventAndCourseSchedules(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeGetUserEventAndCourseSchedules(user, id.userId);
                return yield this.repository.getUserEventAndCourseSchedules(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserEnrolledDepartmentPrograms(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetUserEnrolledDepartmentPrograms(user, id.userId);
                return yield this.repository.getUserEnrolledDepartmentPrograms(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserManagedDepartments(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetUserManagedDepartments(user, id.userId);
                const targetUser = yield this.repository.getUserByIdOrThrow(id);
                if ((0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.ADMIN)) {
                    return yield this.globalRepository.department.getDepartments();
                }
                return yield this.repository.getUserLedDepartments({
                    userId: id.userId,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserManagedDepartmentDivisions(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetUserManagedDepartmentDivisions(user, id.userId);
                const targetUser = yield this.repository.getUserByIdOrThrow(id);
                if ((0, isEqualOrIncludeRole_1.default)(targetUser.role, course_type_1.UserRoleModel.ADMIN)) {
                    return yield this.globalRepository.departmentDivision.getAllExtendedDivisions();
                }
                return yield this.repository.getUserLedDepartmentDivisions({
                    userId: id.userId,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getUserReport(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetUserReport(user, id.userId);
                return yield this.repository.getUserReportOrThrow({
                    userId: id.userId,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateBasicUser(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeUpdateUser(user, id.userId);
                return yield this.repository.updateUser(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateUserEmail(user, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dto, storedRefreshToken } = data;
                dto.email = dto.email.toLowerCase();
                this.authorization.authorizeUpdateUser(user, id.userId);
                return yield this.repository.updateUser(id, Object.assign(Object.assign({}, dto), { refreshToken: [storedRefreshToken] }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateUserPassword(user, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeUpdateUser(user, id.userId);
                return yield this.repository.updateUser(id, Object.assign(Object.assign({}, data.dto), { refreshToken: [data.storedRefreshToken] }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateUserRole(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeUpdateUser(user, id.userId);
                const updatedUser = yield this.repository.updateUser({ userId: id.userId }, dto);
                return this.getPublicUser(updatedUser);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateUserPhoneNumber(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeUpdateUser(user, id.userId);
                return yield this.repository.updateUser(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteUser(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeDeleteUser(user, id.userId);
                return yield this.repository.deleteUser({ userId: id.userId });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
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
                    return yield this.repository.updateUser({ userId: userRelatedToSignInEmail.id }, {
                        accessToken,
                        refreshToken: newRefreshTokenArray,
                    });
                }));
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
                return {};
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
                    return yield this.repository.updateUser({ userId: userRelatedToStoredRefreshToken.id }, {
                        refreshToken: userRelatedToStoredRefreshToken === null || userRelatedToStoredRefreshToken === void 0 ? void 0 : userRelatedToStoredRefreshToken.refreshToken.filter((rt) => rt !== storedRefreshToken),
                    });
                }));
                return {};
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
    getPublicUser(user) {
        const { accessToken, refreshToken, password } = user, publicUser = __rest(user, ["accessToken", "refreshToken", "password"]);
        return publicUser;
    }
};
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.REPOSITORY),
    __metadata("design:type", Object)
], UserService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], UserService.prototype, "globalRepository", void 0);
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], UserService.prototype, "authorization", void 0);
UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
exports.default = UserService;
