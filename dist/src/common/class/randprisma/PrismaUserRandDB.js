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
require("reflect-metadata");
const inversify_1 = require("inversify");
const PrismaClientSingleton_1 = __importDefault(require("../PrismaClientSingleton"));
const RandDBUtil_1 = __importDefault(require("./RandDBUtil"));
const faker_1 = require("@faker-js/faker");
let PrismaUserRandDB = class PrismaUserRandDB extends RandDBUtil_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    generateOne(userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.create({
                data: Object.assign(Object.assign({}, this.generateInputArg()), { role: userRole, dateOfBirth: new Date(), address: faker_1.faker.string.alpha(16), bloodType: faker_1.faker.string.alpha(2).toUpperCase(), lineId: faker_1.faker.string.alpha(10), emergencyNumber: faker_1.faker.string.alpha(10) }),
            });
            return user;
        });
    }
    generateInputArg() {
        return {
            email: this.generateRandomString(8).concat("@gmail.com"),
            password: this.generateRandomString(8),
            name: this.generateRandomString(8),
            NIM: this.generateRandomInteger(1, 1000).toString(),
        };
    }
};
PrismaUserRandDB = __decorate([
    (0, inversify_1.injectable)()
], PrismaUserRandDB);
exports.default = PrismaUserRandDB;
