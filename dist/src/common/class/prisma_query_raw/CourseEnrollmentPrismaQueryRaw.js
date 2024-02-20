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
let CourseEnrollmentPrismaQueryRaw = class CourseEnrollmentPrismaQueryRaw {
    selectForUpdateById(tx, enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = (yield tx.$queryRawUnsafe(`SELECT *
                                                   FROM ${tableName_1.TableName.COURSE_ENROLLMENT}
                                                   WHERE id = ${enrollmentId} FOR UPDATE`));
            if (enrollments.length == 0) {
                return null;
            }
            return (0, prisma_query_raw_utils_1.mapPrismaQueryRawObject)(enrollments[0]);
        });
    }
    selectForUpdateByIdOrThrow(tx, enrollmentId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield this.selectForUpdateById(tx, enrollmentId);
            if (!enrollment) {
                throw error || new RecordNotFoundException_1.default();
            }
            return enrollment;
        });
    }
    selectForUpdateByUserIdAndCourseId(tx, userId_courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, courseId } = userId_courseId;
            const enrollments = (yield tx.$queryRawUnsafe(`SELECT *
                                                   FROM ${tableName_1.TableName.COURSE_ENROLLMENT}
                                                   WHERE user_id = ${userId}
                                                     AND course_id = ${courseId} FOR UPDATE`));
            if (enrollments.length == 0) {
                return null;
            }
            return (0, prisma_query_raw_utils_1.mapPrismaQueryRawObject)(enrollments[0]);
        });
    }
    selectForUpdateByUserIdAndCourseIdOrThrow(tx, userId_courseId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield this.selectForUpdateByUserIdAndCourseId(tx, userId_courseId);
            if (!enrollment) {
                throw error || new RecordNotFoundException_1.default();
            }
            return enrollment;
        });
    }
};
CourseEnrollmentPrismaQueryRaw = __decorate([
    (0, inversify_1.injectable)()
], CourseEnrollmentPrismaQueryRaw);
exports.default = CourseEnrollmentPrismaQueryRaw;
