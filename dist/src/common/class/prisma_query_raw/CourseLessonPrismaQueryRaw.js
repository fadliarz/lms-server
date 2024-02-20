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
const tableName_1 = require("../../constants/tableName");
const RecordNotFoundException_1 = __importDefault(require("../exceptions/RecordNotFoundException"));
const prisma_query_raw_utils_1 = require("./prisma_query_raw.utils");
let CourseLessonPrismaQueryRaw = class CourseLessonPrismaQueryRaw {
    selectForUpdateById(tx, lessonId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lessons = (yield tx.$queryRawUnsafe(`SELECT *
                                               FROM ${tableName_1.TableName.COURSE_LESSON}
                                               WHERE id = ${lessonId} FOR UPDATE`));
            if (lessons.length == 0) {
                return null;
            }
            return (0, prisma_query_raw_utils_1.mapPrismaQueryRawObject)(lessons[0]);
        });
    }
    selectForUpdateByIdOrThrow(tx, lessonId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const lesson = yield this.selectForUpdateById(tx, lessonId);
            if (!lesson) {
                throw error || new RecordNotFoundException_1.default();
            }
            return lesson;
        });
    }
};
CourseLessonPrismaQueryRaw = __decorate([
    (0, inversify_1.injectable)()
], CourseLessonPrismaQueryRaw);
exports.default = CourseLessonPrismaQueryRaw;
