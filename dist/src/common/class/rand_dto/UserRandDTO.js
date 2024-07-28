"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const RandDBUtil_1 = __importDefault(require("../randprisma/RandDBUtil"));
const inversify_1 = require("inversify");
const faker_1 = require("@faker-js/faker");
let UserRandDTO = class UserRandDTO extends RandDBUtil_1.default {
    generateCreateUserDTO() {
        return {
            name: this.generateRandomString(8),
            email: this.generateRandomString(8).concat("@", this.generateRandomString(5), ".", this.generateRandomString(3)),
            password: this.generateRandomString(8),
            NIM: this.generateRandomString(8),
            avatar: this.generateRandomString(16),
            dateOfBirth: new Date(),
            address: faker_1.faker.string.alpha(16),
            bloodType: faker_1.faker.string.alpha(2).toUpperCase(),
            medicalHistories: [this.generateRandomString(8)],
            HMM: [this.generateRandomString(8)],
            UKM: [this.generateRandomString(8)],
            hobbies: [this.generateRandomString(8)],
            lineId: faker_1.faker.string.alpha(10),
            emergencyNumber: faker_1.faker.string.alpha(10),
        };
    }
};
UserRandDTO = __decorate([
    (0, inversify_1.injectable)()
], UserRandDTO);
exports.default = UserRandDTO;
