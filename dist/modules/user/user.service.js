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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const encrypt_1 = __importDefault(require("../../utils/encrypt"));
const inversify_1 = require("inversify");
const user_dITypes_1 = require("./user.dITypes");
const HttpException_1 = __importDefault(require("../../common/exceptions/HttpException"));
const statusCode_1 = require("../../common/constants/statusCode");
const InternalServerErrorException_1 = require("../../common/exceptions/InternalServerErrorException");
const getValuable_1 = require("../../common/functions/getValuable");
let UserService = exports.UserService = class UserService {
    generateFreshAuthenticationToken(type, email) {
        try {
            var privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
            if (type === "refreshToken") {
                privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
            }
            return jsonwebtoken_1.default.sign({ email }, privateKey, {
                expiresIn: Math.floor(Date.now()) + 1000 * 60 * 60 * 24 * 30, // 30 Days
            });
        }
        catch (error) {
            throw new InternalServerErrorException_1.InternalServerErrorException();
        }
    }
    verifyPassword(incomingPassword, encryptedPassword) {
        try {
            return (0, lodash_1.isEqual)((0, encrypt_1.default)(incomingPassword), encryptedPassword);
        }
        catch (error) {
            throw new InternalServerErrorException_1.InternalServerErrorException();
        }
    }
    createNewUserAndGenerateAuthenticationToken(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = userDetails;
                const userBelongToSignUpEmail = yield this.userRepository.getUserByEmail(email);
                if (userBelongToSignUpEmail) {
                    throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, "Email is taken, please try another email!");
                }
                const accessToken = this.generateFreshAuthenticationToken("accessToken", email);
                const refreshToken = this.generateFreshAuthenticationToken("refreshToken", email);
                const encryptedPassword = (0, encrypt_1.default)(userDetails.password);
                userDetails.password = encryptedPassword;
                const newUserDetails = yield this.userRepository.createNewUser(Object.assign(Object.assign({}, userDetails), { accessToken,
                    refreshToken }));
                return (0, getValuable_1.getValuable)(newUserDetails);
            }
            catch (error) {
                throw error;
            }
        });
    }
    signInUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userBelongToSignInEmail = yield this.userRepository.getUserByEmail(email);
                if (!userBelongToSignInEmail) {
                    throw new HttpException_1.default(statusCode_1.StatusCode.NOT_FOUND, "User not found");
                }
                const isPasswordMatch = this.verifyPassword(password, userBelongToSignInEmail.password);
                if (!isPasswordMatch) {
                    throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, "Invalid password");
                }
                const accessToken = this.generateFreshAuthenticationToken("accessToken", email);
                const refreshToken = this.generateFreshAuthenticationToken("refreshToken", email);
                const user = Object.assign(Object.assign({}, userBelongToSignInEmail), { accessToken,
                    refreshToken });
                yield this.userRepository.updateExistingUserDetails(user.id, {
                    accessToken,
                    refreshToken,
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    clearUserAuthenticationToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userRepository.updateExistingUserDetails(userId, {
                    accessToken: "",
                });
            }
            catch (error) {
                throw new InternalServerErrorException_1.InternalServerErrorException();
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(user_dITypes_1.UserTypes.USER_REPOSITORY),
    __metadata("design:type", Object)
], UserService.prototype, "userRepository", void 0);
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)()
], UserService);
