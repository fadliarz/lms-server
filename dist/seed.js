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
/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
// @ts-ignore
// @ts-nocheck
const seed_1 = require("@snaplet/seed");
const course_type_1 = require("./src/modules/course/course.type");
const encrypt_1 = __importDefault(require("./src/utils/encrypt"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const seed = yield (0, seed_1.createSeedClient)();
    yield seed.$resetDatabase();
    const instructors = getIds(1, 5);
    yield seed.user((x) => x(5, ({ seed }) => ({
        role: course_type_1.UserRoleModel.INSTRUCTOR,
        email: `${seed.replace(/[^\w\s]/gi, "")}@mahasiswa.itb.ac.id`.toLowerCase(),
        avatar: "https://picsum.photos/250/250?random=1",
        password: (0, encrypt_1.default)("password"),
    })));
    yield seed.course((x) => x(instructors.length, {
        image: "https://picsum.photos/500/250?random=1",
    }), {
        connect: { user: instructors },
    });
    const courses = getIds(1, instructors.length);
    yield seed.courseLesson((x) => x(5 * courses.length), {
        connect: {
            course: courses,
        },
    });
    const courseLessons = getIds(1, 5 * courses.length);
    yield seed.courseLessonVideo((x) => x(10 * courseLessons.length, {
        youtubeLink: "https://www.youtube.com/watch?v=NyOYW07-L5g&ab_channel=TheOrganicChemistryTutor",
    }), {
        connect: { courseLesson: courseLessons },
    });
    yield seed.user((x) => x(100, ({ seed }) => ({
        role: course_type_1.UserRoleModel.STUDENT,
        email: `${seed.replace(/[^\w\s]/gi, "")}@mahasiswa.itb.ac.id`.toLowerCase(),
        avatar: "https://picsum.photos/250/250?random=1",
        password: (0, encrypt_1.default)("password"),
    })));
    const students = getIds(6, 105);
    yield seed.courseEnrollment((x) => x(300, {
        role: course_type_1.CourseEnrollmentRoleModel.STUDENT,
    }), {
        connect: {
            user: students,
            course: courses,
        },
    });
    const secondInstructors = getIds(106, 155);
    yield seed.user((x) => x(50, ({ seed }) => ({
        role: course_type_1.UserRoleModel.INSTRUCTOR,
        email: `${seed.replace(/[^\w\s]/gi, "")}@mahasiswa.itb.ac.id`.toLowerCase(),
        avatar: "https://picsum.photos/250/250?random=1",
        password: (0, encrypt_1.default)("password"),
    })));
    yield seed.courseEnrollment((x) => x(50, {
        role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
    }), {
        connect: {
            user: secondInstructors,
            course: courses,
        },
    });
    let num = 5;
    const classes = getIds(1, courses.length * num);
    yield seed.courseClass((x) => x(classes.length), {
        connect: {
            course: courses,
        },
    });
    num = 10;
    const assignments = getIds(1, classes.length * num);
    yield seed.courseClassAssignment((x) => x(assignments.length), {
        connect: {
            courseClass: classes,
        },
    });
    console.log("Database seeded successfully!");
    process.exit();
});
function getIds(start, end) {
    const res = [];
    let i;
    for (i = start; i <= end; i++) {
        res.push({ id: i });
    }
    return res;
}
main();
