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
const statusCode_1 = require("../common/constants/statusCode");
const HttpException_1 = __importDefault(require("../common/exceptions/HttpException"));
const client_1 = require("@prisma/client");
const getValuable_1 = require("../common/functions/getValuable");
const getAuthMiddleWare = () => {
    const userTable = new client_1.PrismaClient().user;
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const accessToken = req.cookies.access_token || req.headers.cookie;
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY);
            const user = yield userTable.findFirst({
                where: {
                    email: decoded.email,
                    accessToken,
                },
            });
            if (!user) {
                throw new HttpException_1.default(statusCode_1.StatusCode.NOT_FOUND, "User not found!");
            }
            user.refreshToken = null;
            req.accessToken = accessToken;
            req.user = (0, getValuable_1.getValuable)(user);
            next();
        }
        catch (error) {
            if (!(error instanceof HttpException_1.default)) {
                next(new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, "You are not logged in!"));
            }
            next(error);
        }
    });
};
exports.getAuthMiddleWare = getAuthMiddleWare;
