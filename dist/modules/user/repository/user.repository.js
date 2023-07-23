"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const HttpException_1 = __importDefault(require("../../../common/exceptions/HttpException"));
const statusCode_1 = require("../../../common/constants/statusCode");
let UserRepository = exports.UserRepository = class UserRepository {
    constructor() {
        this.userTable = new client_1.PrismaClient().user;
    }
    getFirstUserByFilter(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userTable.findFirst({ where: filter });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createNewUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUserDetails = yield this.userTable.create({
                    data: Object.assign(Object.assign({}, userDetails), { id: (0, uuid_1.v4)() }),
                });
                return newUserDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userTable.findUnique({
                    where: {
                        email,
                    },
                });
                return user;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateExistingUserDetails(userId, userDetailsUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUserDetails = yield this.userTable.update({
                    where: {
                        id: userId,
                    },
                    data: userDetailsUpdates,
                });
                return updatedUserDetails;
            }
            catch (error) {
                if (error instanceof client_2.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2015") {
                        throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, "User not found");
                    }
                }
                throw error;
            }
        });
    }
};
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRepository);
