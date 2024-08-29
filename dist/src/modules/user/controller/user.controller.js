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
const statusCode_1 = require("../../../common/constants/statusCode");
const inversify_1 = require("inversify");
const user_type_1 = require("../user.type");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const user_joi_1 = require("./user.joi");
const Cookie_1 = require("../../../common/constants/Cookie");
const AuthenticationException_1 = __importDefault(require("../../../common/class/exceptions/AuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
let UserController = class UserController {
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.CreateUserDtoJoi })(req, res, next);
                const { user: newUser, token: { accessToken, refreshToken }, } = yield this.service.createUser(req.body);
                return res
                    .cookie(Cookie_1.Cookie.ACCESS_TOKEN, accessToken, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * Cookie_1.Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
                    secure: process.env.NODE_ENV === "production",
                })
                    .cookie(Cookie_1.Cookie.REFRESH_TOKEN, refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * Cookie_1.Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                })
                    .status(statusCode_1.StatusCode.RESOURCE_CREATED)
                    .json({ data: newUser });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPublicUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ query: user_joi_1.GetPublicUsersQueryJoi })(req, res, next);
                const query = {
                    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
                    pageNumber: req.query.pageNumber
                        ? Number(req.query.pageNumber)
                        : undefined,
                };
                const users = yield this.service.getPublicUsers(query);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: users });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.service.getUserById({
                    userId: this.validateUserId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const me = yield this.service.getMe((0, getRequestUserOrThrowAuthenticationException_1.default)(req));
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: me });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserPermissions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const permissions = yield this.service.getUserPermissions((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: permissions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserAssignments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assignments = yield this.service.getUserAssignments((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: assignments,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserEnrolledAsStudentCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.service.getUserEnrolledAsStudentCourses((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: courses,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserManagedCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield this.service.getUserManagedCourses((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: courses,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserEventAndCourseSchedules(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const upcoming = yield this.service.getUserEventAndCourseSchedules((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: upcoming,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserEnrolledDepartmentPrograms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programs = yield this.service.getUserEnrolledDepartmentPrograms((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: programs,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserManagedDepartments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield this.service.getUserManagedDepartments((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: departments,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserManagedDepartmentDivisions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const divisions = yield this.service.getUserManagedDepartmentDivisions((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: divisions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = yield this.service.getUserReport((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: report,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateBasicUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateBasicUserDtoJoi })(req, res, next);
                const updatedUser = yield this.service.updateBasicUser((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storedRefreshToken = req.cookies[Cookie_1.Cookie.REFRESH_TOKEN];
                if (!storedRefreshToken) {
                    throw new AuthenticationException_1.default();
                }
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateUserEmailDtoJoi })(req, res, next);
                const updatedUser = yield this.service.updateUserEmail((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) }, {
                    dto: req.body,
                    storedRefreshToken,
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storedRefreshToken = req.cookies[Cookie_1.Cookie.REFRESH_TOKEN];
                if (!storedRefreshToken) {
                    throw new AuthenticationException_1.default();
                }
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateUserPasswordDtoJoi })(req, res, next);
                const updatedUser = yield this.service.updateUserPassword((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) }, {
                    dto: req.body,
                    storedRefreshToken,
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateUserRoleDtoJoi })(req, res, next);
                const updatedUser = yield this.service.updateUserRole((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserPhoneNumber(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateUserPhoneNumberDtoJoi })(req, res, next);
                const updatedUser = yield this.service.updateUserPhoneNumber((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteUser((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { userId: this.validateUserId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.SignIn })(req, res, next);
                const { email, password } = req.body;
                yield this.service.signInUser(req, res, { email, password });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: {},
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    signOut(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cookies = req.cookies;
                const storedRefreshToken = cookies[Cookie_1.Cookie.REFRESH_TOKEN];
                if (!storedRefreshToken) {
                    throw new AuthenticationException_1.default();
                }
                yield this.service.signOutUser(storedRefreshToken);
                return res
                    .clearCookie(Cookie_1.Cookie.ACCESS_TOKEN)
                    .clearCookie(Cookie_1.Cookie.REFRESH_TOKEN, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                })
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: {} });
            }
            catch (error) {
                if (error instanceof AuthenticationException_1.default) {
                    res.clearCookie(Cookie_1.Cookie.ACCESS_TOKEN).clearCookie(Cookie_1.Cookie.REFRESH_TOKEN, {
                        httpOnly: true,
                        sameSite: "none",
                        secure: true,
                    });
                }
                next(error);
            }
        });
    }
    validateUserId(req, error) {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) {
            throw error || new NaNException_1.default("userId");
        }
        return userId;
    }
};
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.SERVICE),
    __metadata("design:type", Object)
], UserController.prototype, "service", void 0);
UserController = __decorate([
    (0, inversify_1.injectable)()
], UserController);
exports.default = UserController;
