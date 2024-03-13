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
const PrismaClientSingleton_1 = __importDefault(require("./common/class/PrismaClientSingleton"));
const course_type_1 = require("./modules/course/course.type");
const inversify_1 = require("inversify");
const repository_type_1 = require("./common/class/repository/repository.type");
const rand_dto_type_1 = require("./common/class/rand_dto/rand_dto.type");
const inversifyConfig_1 = __importDefault(require("./inversifyConfig"));
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let DatabaseLock = class DatabaseLock {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    testBang() {
        return __awaiter(this, void 0, void 0, function* () {
            const author = yield this.repository.user.createUser(this.randDTO.user.generateCreateUserDTO(), "", []);
            yield this.repository.user.unauthorizedUpdateUser(author.id, {
                role: course_type_1.UserRoleModel.INSTRUCTOR,
            });
            const category = yield this.repository.courseCategory.createCategory({ userId: author.id }, { title: "someTitle" });
            const course = yield this.repository.course.createCourse({
                userId: author.id,
            }, this.randDTO.course.generateCreateCourseDTO(category.id));
            const resourceId = {
                userId: author.id,
                courseId: course.id,
            };
            const dto = {
                title: "someTitle",
            };
            const lesson = yield this.repository.courseLesson.createLesson(resourceId, dto);
            const video = yield this.prisma.courseLessonVideo.create({
                data: {
                    lessonId: lesson.id,
                    totalDurations: 12,
                    youtubeLink: "someYoutubeLink",
                    description: "someDescription",
                    name: "someName",
                },
            });
            console.log(video);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(repository_type_1.RepositoryDITypes.FACADE),
    __metadata("design:type", repository_type_1.IRepository)
], DatabaseLock.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(rand_dto_type_1.RandDTODITypes.FACADE),
    __metadata("design:type", rand_dto_type_1.IRandDTO)
], DatabaseLock.prototype, "randDTO", void 0);
DatabaseLock = __decorate([
    (0, inversify_1.injectable)()
], DatabaseLock);
inversifyConfig_1.default.bind("DatabaseLock").to(DatabaseLock);
const db = inversifyConfig_1.default.get("DatabaseLock");
db.testBang();
