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
const HttpException_1 = __importDefault(require("../../../common/exceptions/HttpException"));
const handleError_1 = require("../../../common/exceptions/handleError");
let UserController = exports.UserController = class UserController {
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userService.createNewUserAndGenerateAuthenticationToken(req.body);
                return res
                    .cookie("access_token", newUser.accessToken, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: process.env.NODE_ENV === "production",
                })
                    .cookie("refresh_token", newUser.refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                })
                    .status(statusCode_1.StatusCode.RESOURCE_CREATED)
                    .json(newUser);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, next);
            }
        });
    }
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userService.signInUser(email, password);
                return res
                    .cookie("access_token", user.accessToken, {
                    httpOnly: false,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: process.env.NODE_ENV === "production",
                })
                    .cookie("refresh_token", user.refreshToken, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                })
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json(user);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, next);
            }
        });
    }
    logOut(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authenticatedRequest = req;
                if (!authenticatedRequest.user) {
                    next(new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, "User is unauthenticated"));
                }
                yield this.userService.clearUserAuthenticationToken((_a = authenticatedRequest.user) === null || _a === void 0 ? void 0 : _a.id);
                return res
                    .clearCookie("access_token")
                    .status(statusCode_1.StatusCode.SUCCESS)
                    .json({});
            }
            catch (error) {
                (0, handleError_1.handleError)(error, next);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.USER_SERVICE),
    __metadata("design:type", Object)
], UserController.prototype, "userService", void 0);
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)()
], UserController);
