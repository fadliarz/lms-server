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
require("reflect-metadata");
const RandDBUtil_1 = __importDefault(require("./RandDBUtil"));
const rand_type_1 = require("./rand.type");
const course_type_1 = require("../../../modules/course/course.type");
const PrismaClientSingleton_1 = __importDefault(require("../PrismaClientSingleton"));
const inversify_1 = require("inversify");
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../functions/isEqualOrIncludeCourseEnrollmentRole"));
class PrismaCourseEnrollmentRandDB extends RandDBUtil_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    generateOne({ authorUserRole, userRole, enrollmentRole, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { author, category, course } = yield this.course.generateOne(authorUserRole);
            const user = yield this.user.generateOne(userRole);
            const enrollment = yield this.prisma.courseEnrollment.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                    role: enrollmentRole,
                },
            });
            const updatedCourse = yield this.prisma.course.update({
                where: {
                    id: course.id,
                },
                data: (0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollmentRole, course_type_1.CourseEnrollmentRoleModel.STUDENT)
                    ? { totalStudents: 1 }
                    : { totalInstructors: 1 },
            });
            return {
                author,
                enrolledUser: user,
                category,
                course: updatedCourse,
                enrollment,
            };
        });
    }
}
exports.default = PrismaCourseEnrollmentRandDB;
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.USER),
    __metadata("design:type", Object)
], PrismaCourseEnrollmentRandDB.prototype, "user", void 0);
__decorate([
    (0, inversify_1.inject)(rand_type_1.PrismaRandDBDITypes.COURSE),
    __metadata("design:type", Object)
], PrismaCourseEnrollmentRandDB.prototype, "course", void 0);
