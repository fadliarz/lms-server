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
let CourseLessonVideoRandDTO = class CourseLessonVideoRandDTO extends RandDBUtil_1.default {
    generateCreateLessonVideoDTO() {
        return {
            name: "someName",
            description: "someDescription",
            youtubeLink: "someYoutubeLink",
            totalDurations: this.generateRandomInteger(10, 1000),
        };
    }
};
CourseLessonVideoRandDTO = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonVideoRandDTO);
exports.default = CourseLessonVideoRandDTO;
