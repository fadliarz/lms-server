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
exports.CourseRepository = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
const statusCode_1 = require("../../../common/constants/statusCode");
const HttpException_1 = __importDefault(require("../../../common/exceptions/HttpException"));
let CourseRepository = exports.CourseRepository = class CourseRepository {
    constructor() {
        this.courseTable = new client_1.PrismaClient().course;
    }
    createCourse(userId, courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseTable.create({
                    data: Object.assign(Object.assign({}, courseDetails), { id: (0, uuid_1.v4)(), authorId: userId }),
                });
                return course;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCourse(userId, courseId, courseDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.courseTable.findFirst({
                    where: {
                        id: courseId,
                        authorId: userId,
                    },
                });
                if (!course) {
                    throw new HttpException_1.default(statusCode_1.StatusCode.NOT_FOUND, "Course not found!");
                }
                const updatedCourse = yield this.courseTable.update({
                    where: { id: courseId },
                    data: courseDetails,
                });
                return updatedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
exports.CourseRepository = CourseRepository = __decorate([
    (0, inversify_1.injectable)()
], CourseRepository);
