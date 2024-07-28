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
exports.generateRandomCreateCourseDto = exports.createRandomCourses = exports.createRandomCourse = exports.createRandomCategory = exports.createRandomUser = void 0;
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const getValuable_1 = __importDefault(require("../getValuable"));
const prisma = new client_1.PrismaClient();
function createRandomUser(userRole) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.create({
            data: {
                email: faker_1.faker.string.alpha(16).concat("@gmail.com"),
                password: faker_1.faker.string.alpha(16),
                name: faker_1.faker.string.alpha(16),
                NIM: faker_1.faker.number.int({ min: 13121000, max: 13121300 }).toString(),
                dateOfBirth: new Date(),
                address: faker_1.faker.string.alpha(16),
                bloodType: faker_1.faker.string.alpha(2).toUpperCase(),
                lineId: faker_1.faker.string.alpha(10),
                emergencyNumber: faker_1.faker.string.alpha(10),
            },
        });
        return (0, getValuable_1.default)(user);
    });
}
exports.createRandomUser = createRandomUser;
function createRandomCategory() {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield prisma.courseCategory.create({
            data: {
                title: faker_1.faker.string.alpha(8),
            },
        });
        return category;
    });
}
exports.createRandomCategory = createRandomCategory;
function createRandomCourse(userRole) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield createRandomCategory();
        const user = yield createRandomUser(userRole);
        const course = yield prisma.course.create({
            data: {
                code: faker_1.faker.string.alpha(5),
                title: faker_1.faker.string.alpha(8),
                authorId: user.id,
                categoryId: category.id,
            },
        });
        return course;
    });
}
exports.createRandomCourse = createRandomCourse;
function createRandomCourses(userRole, numberOfCourses) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = yield createRandomCategory();
        const user = yield createRandomUser(userRole);
        let arg = [];
        for (let i = 0; i < numberOfCourses; i++) {
            arg.push({
                title: faker_1.faker.string.alpha(8),
                authorId: user.id,
                categoryId: category.id,
                code: faker_1.faker.string.alpha(10),
            });
        }
        const courses = yield prisma.course.createMany({
            data: arg,
        });
        return courses;
    });
}
exports.createRandomCourses = createRandomCourses;
function generateRandomCreateCourseDto(categoryId) {
    return {
        title: faker_1.faker.string.alpha(8),
        code: faker_1.faker.string.alpha(10),
        categoryId,
        image: faker_1.faker.string.alpha(16),
        description: faker_1.faker.string.alpha(16),
        material: faker_1.faker.string.alpha(16),
    };
}
exports.generateRandomCreateCourseDto = generateRandomCreateCourseDto;
