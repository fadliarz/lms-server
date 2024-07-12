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
const HttpException_1 = __importDefault(require("../../../common/class/exceptions/HttpException"));
const statusCode_1 = require("../../../common/constants/statusCode");
const validateEnv_1 = __importDefault(require("../../../common/functions/validateEnv"));
const errorCode_1 = require("../../../common/constants/errorCode");
const errorMessage_1 = require("../../../common/constants/errorMessage");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const Cookie_1 = require("../../../common/constants/Cookie");
const AuthenticationException_1 = __importDefault(require("../../../common/class/exceptions/AuthenticationException"));
let UserService = class UserService {
    createUser(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = dto;
            const existingUser = yield this.repository.getUserByEmail(email);
            if (existingUser) {
                throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.BAD_REQUEST, errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.UNIQUE_CONSTRAINT]("email"), true);
            }
            const accessToken = this.generateFreshAuthenticationToken(Cookie_1.Cookie.ACCESS_TOKEN, email);
            const refreshToken = this.generateFreshAuthenticationToken(Cookie_1.Cookie.REFRESH_TOKEN, email);
            dto.password = (0, encrypt_1.default)(password);
            const newUser = yield this.repository.createUser(dto, accessToken, [
                refreshToken,
            ]);
            return newUser;
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
    getMe(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const me = yield this.repository.getMe(userId, targetUserId);
            me.accessToken = null;
            me.refreshToken = [];
            return me;
        });
    }
    updateBasicUser(userId, targetUserId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.repository.updateUser(userId, targetUserId, dto);
            return updatedUser;
        });
    }
    updateUserEmail(userId, targetUserId, storedRefreshToken, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.repository.updateUser(userId, targetUserId, Object.assign(Object.assign({}, dto), { refreshToken: [storedRefreshToken] }));
            return updatedUser;
        });
    }
    updateUserPassword(userId, targetUserId, storedRefreshToken, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.repository.updateUser(userId, targetUserId, Object.assign(Object.assign({}, dto), { refreshToken: [storedRefreshToken] }));
            return updatedUser;
        });
    }
    updateUserPhoneNumber(userId, targetUserId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.repository.updateUser(userId, targetUserId, dto);
            return updatedUser;
        });
    }
    deleteUser(userId, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.repository.deleteUser(userId, targetUserId);
            return deletedUser;
        });
    }
    signInUser(req, res, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = dto;
            const userRelatedToSignInEmail = yield this.repository.getUserByEmail(email);
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
                const userBelongToStoredRefreshToken = yield this.repository.getUserByRefreshToken(storedRefreshToken);
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
            yield this.repository.unauthorizedUpdateUser(userRelatedToSignInEmail.id, {
                accessToken,
                refreshToken: newRefreshTokenArray,
            });
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
        });
    }
    signOutUser(storedRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRelatedToStoredRefreshToken = yield this.repository.getUserByRefreshToken(storedRefreshToken);
            if (!userRelatedToStoredRefreshToken) {
                throw new AuthenticationException_1.default();
            }
            yield this.repository.unauthorizedUpdateUser(userRelatedToStoredRefreshToken.id, {
                refreshToken: userRelatedToStoredRefreshToken === null || userRelatedToStoredRefreshToken === void 0 ? void 0 : userRelatedToStoredRefreshToken.refreshToken.filter((rt) => rt !== storedRefreshToken),
            });
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
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
