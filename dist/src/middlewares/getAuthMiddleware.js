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
const AuthenticationException_1 = __importDefault(require("../common/class/exceptions/AuthenticationException"));
const Cookie_1 = require("../common/constants/Cookie");
const inversifyConfig_1 = __importDefault(require("../inversifyConfig"));
const user_type_1 = require("../modules/user/user.type");
const getValuable_1 = __importDefault(require("../common/functions/getValuable"));
const refreshToken_1 = __importDefault(require("./refreshToken"));
const getAuthMiddleWare = () => {
    const userRepository = inversifyConfig_1.default.get(user_type_1.UserDITypes.REPOSITORY);
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const accessToken = req.cookies[Cookie_1.Cookie.ACCESS_TOKEN];
        if (!accessToken) {
            throw new AuthenticationException_1.default();
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
            const user = yield userRepository.getUserByAccessToken(accessToken);
            if (!user) {
                throw new Error();
            }
            if (user.email == decoded.email) {
                user.password = null;
                user.refreshToken = null;
                user.accessToken = null;
                req.user = (0, getValuable_1.default)(user);
                next();
            }
        }
        catch (_a) {
            /**
             * Expired access token!
             *
             */
            (0, refreshToken_1.default)(req, res, next);
        }
    });
};
exports.getAuthMiddleWare = getAuthMiddleWare;
