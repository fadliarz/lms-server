"use strict";
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
const PrismaClientSingleton_1 = __importDefault(require("../src/common/class/PrismaClientSingleton"));
const course_type_1 = require("../src/modules/course/course.type");
const encrypt_1 = __importDefault(require("../src/utils/encrypt"));
const prisma = PrismaClientSingleton_1.default.getInstance();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.user.create({
            data: {
                email: "string@admin.com",
                password: (0, encrypt_1.default)("string"),
                role: course_type_1.UserRoleModel.OWNER,
                name: "admin",
                NIM: "131",
            },
        });
        yield prisma.user.create({
            data: {
                email: "string@instructor.com",
                password: (0, encrypt_1.default)("string"),
                role: course_type_1.UserRoleModel.INSTRUCTOR,
                name: "instructor",
                NIM: "131",
            },
        });
        yield prisma.user.create({
            data: {
                email: "string@student.com",
                password: (0, encrypt_1.default)("string"),
                role: course_type_1.UserRoleModel.STUDENT,
                name: "student",
                NIM: "131",
            },
        });
        const { id: categoryId } = yield prisma.courseCategory.create({
            data: {
                title: "someTitle",
            },
        });
        const author = yield prisma.user.create({
            data: {
                email: "string@author.com",
                password: (0, encrypt_1.default)("string"),
                role: course_type_1.UserRoleModel.INSTRUCTOR,
                name: "author",
                NIM: "131",
            },
        });
        yield prisma.course.create({
            data: {
                authorId: author.id,
                title: "string",
                categoryId,
            },
        });
    });
}
exports.default = seed;
