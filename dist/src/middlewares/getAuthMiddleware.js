"use strict";
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
exports.getAuthMiddleWare = void 0;
require("reflect-metadata");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getValuable_1 = __importDefault(require("../common/functions/getValuable"));
const AuthenticationException_1 = __importDefault(require("../common/class/exceptions/AuthenticationException"));
const Cookie_1 = require("../common/constants/Cookie");
const inversifyConfig_1 = __importDefault(require("../inversifyConfig"));
const user_type_1 = require("../modules/user/user.type");
const ForbiddenException_1 = __importDefault(require("../common/class/exceptions/ForbiddenException"));
const getAuthMiddleWare = () => {
    const userService = inversifyConfig_1.default.get(user_type_1.UserDITypes.SERVICE);
    const userRepository = inversifyConfig_1.default.get(user_type_1.UserDITypes.REPOSITORY);
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const storedRefreshToken = req.cookies[Cookie_1.Cookie.ACCESS_TOKEN];
            if (!storedRefreshToken) {
                throw new AuthenticationException_1.default();
            }
            let decoded;
            const user = yield userRepository.getUserByRefreshToken(storedRefreshToken);
            if (!user) {
                try {
                    decoded = jsonwebtoken_1.default.verify(storedRefreshToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
                    const userRelatedToEmail = yield userRepository.getUserByEmail(decoded.email);
                    /**
                     * Detected refresh token reuse!
                     *
                     * Account is hacked, clear refreshToken!.
                     *
                     */
                    if (userRelatedToEmail) {
                        yield userRepository.unauthorizedUpdateUser(userRelatedToEmail.id, {
                            refreshToken: [],
                        });
                    }
                    throw new Error();
                }
                catch (error) {
                    throw new ForbiddenException_1.default();
                }
            }
            try {
                decoded = jsonwebtoken_1.default.verify(storedRefreshToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
                if (decoded.email !== user.email) {
                    throw new Error();
                }
                /**
                 * At this point, it's proven that the refreshToken is still valid
                 *
                 */
                const accessToken = yield userService.generateFreshAuthenticationToken(Cookie_1.Cookie.ACCESS_TOKEN, decoded.email);
                const refreshToken = yield userService.generateFreshAuthenticationToken(Cookie_1.Cookie.REFRESH_TOKEN, decoded.email);
                res
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
                });
            }
            catch (error) {
                /**
                 * Some possible scenarios:
                 *
                 * 1. Expired refreshToken
                 * 2. User email and decoded email don't match
                 *
                 */
                throw new ForbiddenException_1.default();
            }
            user.password = null;
            user.refreshToken = null;
            user.accessToken = null;
            req.user = (0, getValuable_1.default)(user);
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.getAuthMiddleWare = getAuthMiddleWare;
