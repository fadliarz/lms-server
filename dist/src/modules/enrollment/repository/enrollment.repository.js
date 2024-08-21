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
const inversify_1 = require("inversify");
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
let CourseEnrollmentRepository = class CourseEnrollmentRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    createEnrollment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { courseId } = id;
            return this.db.courseEnrollment.create({
                data: Object.assign(Object.assign({}, data), { courseId }),
            });
        });
    }
    getEnrollmentByUserIdAndCourseId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseEnrollment.findUnique({
                where: {
                    userId_courseId: id,
                },
            });
        });
    }
    updateEnrollment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseEnrollment.update({
                where: this.getWhereObjectForSecondLevelOperation(id),
                data,
            });
        });
    }
    deleteEnrollment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseEnrollment.delete({
                where: this.getWhereObjectForSecondLevelOperation(id),
                select: {},
            });
        });
    }
    getWhereObjectForFirstLevelOperation(id) {
        return id;
    }
    getWhereObjectForSecondLevelOperation(id) {
        const { enrollmentId, resourceId } = id;
        return resourceId
            ? { id: enrollmentId, course: { id: resourceId.courseId } }
            : { id: enrollmentId };
    }
};
CourseEnrollmentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CourseEnrollmentRepository);
exports.default = CourseEnrollmentRepository;
