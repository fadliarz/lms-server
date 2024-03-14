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
exports.UserController = void 0;
const statusCode_1 = require("../../../common/constants/statusCode");
const inversify_1 = require("inversify");
const user_type_1 = require("../user.type");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const getValuable_1 = __importDefault(require("../../../common/functions/getValuable"));
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const user_joi_1 = require("./user.joi");
const Cookie_1 = require("../../../common/constants/Cookie");
const AuthenticationException_1 = __importDefault(require("../../../common/class/exceptions/AuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const filterUserObject_1 = __importDefault(require("../../../common/functions/filterUserObject"));
let UserController = class UserController {
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.CreateUserDtoJoi })(req, res, next);
                const newUser = yield this.service.createUser(req.body);
                return res
                    .cookie(Cookie_1.Cookie.ACCESS_TOKEN, newUser.accessToken, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * Cookie_1.Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
                    secure: process.env.NODE_ENV === "production",
                })
                    .cookie(Cookie_1.Cookie.REFRESH_TOKEN, newUser.refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * Cookie_1.Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                })
                    .status(statusCode_1.StatusCode.RESOURCE_CREATED)
                    .json({ data: (0, filterUserObject_1.default)(newUser) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPublicUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateUserId(req);
                const publicUser = yield this.service.getPublicUserById(userId);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, getValuable_1.default)(publicUser) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateResourceId(req);
                const targetUserId = this.validateUserId(req);
                const me = yield this.service.getMe(userId, targetUserId);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, filterUserObject_1.default)(me) });
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
                const userId = this.validateResourceId(req);
                const targetUserId = this.validateUserId(req);
                const updatedUser = yield this.service.updateBasicUser(userId, targetUserId, req.body);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, filterUserObject_1.default)(updatedUser) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateUserEmailDtoJoi })(req, res, next);
                const userId = this.validateResourceId(req);
                const targetUserId = this.validateUserId(req);
                const updatedUser = yield this.service.updateUserEmail(userId, targetUserId, req.body);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, filterUserObject_1.default)(updatedUser) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: user_joi_1.UpdateUserPasswordDtoJoi })(req, res, next);
                const userId = this.validateResourceId(req);
                const targetUserId = this.validateUserId(req);
                const updatedUser = yield this.service.updateUserPassword(userId, targetUserId, req.body);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, filterUserObject_1.default)(updatedUser) });
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
                const userId = this.validateResourceId(req);
                const targetUserId = this.validateUserId(req);
                const updatedUser = yield this.service.updateUserPhoneNumber(userId, targetUserId, req.body);
                return res
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({ data: (0, filterUserObject_1.default)(updatedUser) });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = this.validateResourceId(req);
                const targetUserId = this.validateUserId(req);
                yield this.service.deleteUser(userId, targetUserId);
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
                const user = yield this.service.signInUser(req, res, { email, password });
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
    validateResourceId(req, error) {
        const { id: userId } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        return userId;
    }
};
exports.UserController = UserController;
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.SERVICE),
    __metadata("design:type", Object)
], UserController.prototype, "service", void 0);
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)()
], UserController);
