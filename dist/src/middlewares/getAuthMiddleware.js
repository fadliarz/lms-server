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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getValuable_1 = __importDefault(require("../common/functions/getValuable"));
const AuthenticationException_1 = __importDefault(require("../common/class/exceptions/AuthenticationException"));
const RecordNotFoundException_1 = __importDefault(require("../common/class/exceptions/RecordNotFoundException"));
const PrismaClientSingleton_1 = __importDefault(require("../common/class/PrismaClientSingleton"));
const Cookie_1 = require("../common/constants/Cookie");
const getAuthMiddleWare = () => {
    const userTable = PrismaClientSingleton_1.default.getInstance().user;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies[Cookie_1.Cookie.ACCESS_TOKEN] || req.headers.cookie;
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
            }
            catch (error) {
                throw new AuthenticationException_1.default();
            }
            const user = yield userTable.findFirst({
                where: {
                    email: decoded.email,
                    accessToken,
                },
            });
            /**
             * Some possible scenarios:
             *
             * 1. User changed the email
             * 2. Deleted user
             *
             */
            if (!user) {
                throw new RecordNotFoundException_1.default("User not found!");
            }
            user.refreshToken = [];
            req.accessToken = accessToken;
            req.user = (0, getValuable_1.default)(user);
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.getAuthMiddleWare = getAuthMiddleWare;
