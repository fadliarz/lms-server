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
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const encrypt_1 = __importDefault(require("../src/utils/encrypt"));
const prisma = new client_1.PrismaClient();
const courseLikeTable = prisma.courseLike;
const courseEnrollmentTable = prisma.courseEnrollment;
const courseLessonTable = prisma.courseLesson;
const courseLessonVideoTable = prisma.courseLessonVideo;
const courseTable = prisma.course;
const courseCategoryTable = prisma.courseCategory;
const userTable = prisma.user;
function cleanTables() {
    return __awaiter(this, void 0, void 0, function* () {
        yield courseLikeTable.deleteMany();
        yield courseEnrollmentTable.deleteMany();
        yield courseLessonVideoTable.deleteMany();
        yield courseLessonTable.deleteMany();
        yield courseLessonVideoTable.deleteMany();
        yield courseTable.deleteMany();
        yield courseCategoryTable.deleteMany();
        yield userTable.deleteMany();
    });
}
function generateSample(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function generateCourseCreateInputArray(total, authorId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const courses = [];
            let id = 0;
            let { id: maxId } = yield prisma.courseCategory.findFirstOrThrow({
                orderBy: {
                    id: "desc",
                },
            });
            for (let index = 0; index < total; index++) {
                id = (yield prisma.courseCategory.findMany({
                    skip: id === 0 ? 0 : 1,
                    take: 1,
                    cursor: id === 0
                        ? undefined
                        : {
                            id,
                        },
                    select: {
                        id: true,
                    },
                }))[0].id;
                const courseObject = {
                    title: faker_1.faker.lorem.word(),
                    authorId,
                    image: faker_1.faker.image.url(),
                    categoryId: id,
                };
                if (id === maxId) {
                    id = 0;
                }
                courses.push(courseObject);
            }
            return courses;
        }
        catch (error) {
            console.log("Failed creating course create input array!");
            throw error;
        }
    });
}
function insertCourses(coursePerInstructorOrAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let count = 0;
            let instructor;
            let admin;
            let instructorCursor = -1;
            let adminCursor = -1;
            const { id: maxInstructorId } = yield userTable.findFirstOrThrow({
                where: {
                    role: client_1.Role.INSTRUCTOR,
                },
                orderBy: {
                    id: "desc",
                },
                select: { id: true },
            });
            const { id: maxAdminId } = yield userTable.findFirstOrThrow({
                where: {
                    role: client_1.Role.OWNER,
                },
                orderBy: {
                    id: "desc",
                },
                select: { id: true },
            });
            while (instructorCursor < maxInstructorId) {
                const instructors = yield userTable.findMany({
                    skip: instructorCursor === -1 ? 0 : 1,
                    take: 1,
                    cursor: instructorCursor === -1
                        ? undefined
                        : {
                            id: instructorCursor,
                        },
                    where: {
                        role: client_1.Role.INSTRUCTOR,
                    },
                    select: {
                        id: true,
                    },
                });
                instructor = instructors[0];
                instructorCursor = instructor.id;
                const courses = yield courseTable.createMany({
                    data: yield generateCourseCreateInputArray(coursePerInstructorOrAdmin, instructor.id),
                });
                count += courses.count;
            }
            while (adminCursor < maxAdminId) {
                const admins = yield userTable.findMany({
                    skip: adminCursor === -1 ? 0 : 1,
                    take: 1,
                    cursor: adminCursor === -1
                        ? undefined
                        : {
                            id: adminCursor,
                        },
                    where: {
                        role: client_1.Role.OWNER,
                    },
                    select: {
                        id: true,
                    },
                });
                admin = admins[0];
                adminCursor = admin.id;
                const courses = yield courseTable.createMany({
                    data: yield generateCourseCreateInputArray(coursePerInstructorOrAdmin, admin.id),
                });
                count += courses.count;
            }
            console.log("Completed inserting " + count + " courses to the database!");
            return {
                count,
            };
        }
        catch (error) {
            console.log("Failed inserting courses: " + error.message || "Unknown error");
            throw error;
        }
    });
}
function insertLessons(lessonPerCourse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let count = 0;
            const { id: maxCourseId } = yield courseTable.findFirstOrThrow({
                orderBy: {
                    id: "desc",
                },
                select: {
                    id: true,
                },
            });
            let myCursor = -1;
            let course;
            while (myCursor < maxCourseId) {
                const courses = yield courseTable.findMany({
                    take: 1,
                    skip: myCursor === -1 ? 0 : 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    select: {
                        id: true,
                    },
                });
                course = courses[0];
                myCursor = course.id;
                const data = [];
                for (let index = 0; index < lessonPerCourse; index++) {
                    data.push({
                        courseId: course.id,
                        title: faker_1.faker.lorem.word(),
                        description: faker_1.faker.lorem.words(5),
                    });
                }
                const lessons = yield courseLessonTable.createMany({
                    data,
                });
                count += lessons.count;
            }
            console.log("Completed inserting " + count + " course lessons to the database!");
        }
        catch (error) {
            console.log("Failed inserting course lessons: " + error.message || "Unknown error");
            throw error;
        }
    });
}
function insertVideos(videoPerCourse) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let count = 0;
            const { id: maxLessonId } = yield courseLessonTable.findFirstOrThrow({
                orderBy: {
                    id: "desc",
                },
                select: {
                    id: true,
                },
            });
            let myCursor = -1;
            let lesson;
            while (myCursor < maxLessonId) {
                const lessons = yield courseLessonTable.findMany({
                    take: 1,
                    skip: myCursor === -1 ? 0 : 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    select: {
                        id: true,
                    },
                });
                lesson = lessons[0];
                myCursor = lesson.id;
                const data = [];
                for (let index = 0; index < videoPerCourse; index++) {
                    data.push({
                        lessonId: lesson.id,
                        name: faker_1.faker.lorem.word(),
                        description: faker_1.faker.lorem.words(5),
                        totalDurations: faker_1.faker.number.float({ min: 2, max: 100 }),
                        youtubeLink: generateSample([
                            "https://www.youtube.com/watch?v=URwmzTeuHdk&pp=ygUOaHVzc2VpbiBuYXNzZXI%3D",
                            "https://www.youtube.com/watch?v=GsF8R6DBxSg&pp=ygUOaHVzc2VpbiBuYXNzZXI%3D",
                            "https://www.youtube.com/watch?v=BTD5I1BMx2Q&pp=ygUOaHVzc2VpbiBuYXNzZXI%3D",
                        ]),
                    });
                }
                const videos = yield courseLessonVideoTable.createMany({
                    data,
                });
                count += videos.count;
            }
            console.log("Completed inserting " + count + " course videos to the database!");
        }
        catch (error) {
            console.log("Failed inserting course videos: " + error.message || "Unknown error");
            throw error;
        }
    });
}
function insertCourseEnrollments(enrollmentPerCase) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let count = 0;
            let myCursor = -1;
            let course;
            const { id: maxCourseId } = yield prisma.course.findFirstOrThrow({
                select: { id: true },
                orderBy: {
                    id: "desc",
                },
            });
            while (myCursor < maxCourseId) {
                const courses = yield prisma.course.findMany({
                    skip: myCursor === -1 ? 0 : 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    select: {
                        id: true,
                        authorId: true,
                    },
                });
                course = courses[0];
                myCursor = course.id;
                const [studentsAsStudent, instructorsAsStudent, adminsAsStudent] = yield Promise.all([
                    prisma.user.findMany({
                        where: {
                            role: client_1.Role.STUDENT,
                        },
                        take: enrollmentPerCase,
                        select: {
                            id: true,
                        },
                    }),
                    prisma.user.findMany({
                        where: {
                            role: client_1.Role.INSTRUCTOR,
                            id: {
                                notIn: [course.authorId],
                            },
                        },
                        take: enrollmentPerCase,
                        select: {
                            id: true,
                        },
                    }),
                    prisma.user.findMany({
                        where: {
                            role: client_1.Role.OWNER,
                            id: {
                                notIn: [course.authorId],
                            },
                        },
                        take: enrollmentPerCase,
                        select: {
                            id: true,
                        },
                    }),
                ]);
                const [instructorsAsInstructor, adminsAsInstructor] = yield Promise.all([
                    prisma.user.findMany({
                        where: {
                            role: client_1.Role.INSTRUCTOR,
                            id: {
                                notIn: [
                                    ...instructorsAsStudent.map((instructor) => instructor.id),
                                    course.authorId,
                                ],
                            },
                        },
                        take: enrollmentPerCase,
                        select: {
                            id: true,
                        },
                    }),
                    prisma.user.findMany({
                        where: {
                            role: client_1.Role.OWNER,
                            id: {
                                notIn: [
                                    ...adminsAsStudent.map((admin) => admin.id),
                                    course.authorId,
                                ],
                            },
                        },
                        take: enrollmentPerCase,
                        select: {
                            id: true,
                        },
                    }),
                ]);
                yield Promise.all([
                    prisma.courseEnrollment.createMany({
                        data: studentsAsStudent.map((user) => {
                            return {
                                courseId: course.id,
                                userId: user.id,
                                role: client_1.Role.STUDENT,
                            };
                        }),
                    }),
                    prisma.courseEnrollment.createMany({
                        data: instructorsAsStudent.map((user) => {
                            return {
                                courseId: course.id,
                                userId: user.id,
                                role: client_1.Role.STUDENT,
                            };
                        }),
                    }),
                    prisma.courseEnrollment.createMany({
                        data: adminsAsStudent.map((user) => {
                            return {
                                courseId: course.id,
                                userId: user.id,
                                role: client_1.Role.STUDENT,
                            };
                        }),
                    }),
                    prisma.courseEnrollment.createMany({
                        data: instructorsAsInstructor.map((user) => {
                            return {
                                courseId: course.id,
                                userId: user.id,
                                role: client_1.Role.INSTRUCTOR,
                            };
                        }),
                    }),
                    prisma.courseEnrollment.createMany({
                        data: adminsAsInstructor.map((user) => {
                            return {
                                courseId: course.id,
                                userId: user.id,
                                role: client_1.Role.INSTRUCTOR,
                            };
                        }),
                    }),
                ]).then((datas) => {
                    datas.forEach((data) => {
                        count += data.count;
                    });
                });
            }
            console.log("Completed inserting " + count + " course enrollments to the database!");
            return { count };
        }
        catch (error) {
            console.log("Failed inserting course enrollments: " + error.message || "Unknown error");
            throw error;
        }
    });
}
function insertCourseLikes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let myCursor = -1;
            let count = 0;
            let enrollment;
            const { id: maxEnrollmentId } = yield prisma.courseEnrollment.findFirstOrThrow({
                where: {
                    role: client_1.Role.STUDENT,
                },
                orderBy: {
                    id: "desc",
                },
                select: {
                    id: true,
                },
            });
            while (myCursor < maxEnrollmentId) {
                const enrollments = yield prisma.courseEnrollment.findMany({
                    skip: myCursor === -1 ? 0 : 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    where: {
                        role: client_1.Role.STUDENT,
                    },
                });
                enrollment = enrollments[0];
                myCursor = enrollment.id;
                yield prisma.courseLike.create({
                    data: {
                        userId: enrollment.userId,
                        courseId: enrollment.courseId,
                    },
                });
                count++;
            }
            console.log("Completed inserting course like! count: ", count);
        }
        catch (error) {
            console.log("Error inserting course like: " + error.message || "unknown error");
            throw error;
        }
    });
}
function insertCourseCategories(total) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let input = [];
            for (let index = 0; index < total; index++) {
                input.push({
                    title: faker_1.faker.word.words(),
                });
            }
            yield prisma.courseCategory.createMany({
                data: input,
            });
            console.log("Completed inserting course category! count: ", total);
        }
        catch (error) {
            console.log("Error inserting course category: " + error.message || "unknown error");
        }
    });
}
function updateCourseCount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let myCursor = -1;
            let course;
            const { id: maxId } = yield courseTable.findFirstOrThrow({
                orderBy: {
                    id: "desc",
                },
                select: { id: true },
            });
            while (myCursor < maxId) {
                const courses = yield courseTable.findMany({
                    skip: myCursor === -1 ? undefined : 1,
                    take: 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    select: {
                        id: true,
                    },
                });
                course = courses[0];
                myCursor = course.id;
                const totalStudents = yield courseEnrollmentTable.count({
                    where: {
                        courseId: course.id,
                        role: client_1.Role.STUDENT,
                    },
                });
                const totalInstructors = yield courseEnrollmentTable.count({
                    where: {
                        courseId: course.id,
                        role: client_1.Role.INSTRUCTOR,
                    },
                });
                const totalLessons = yield courseLessonTable.count({
                    where: {
                        courseId: course.id,
                    },
                });
                const totalLikes = yield courseLikeTable.count({
                    where: {
                        courseId: course.id,
                    },
                });
                yield courseTable.update({
                    where: {
                        id: course.id,
                    },
                    data: {
                        totalStudents,
                        totalInstructors,
                        totalLessons,
                        totalLikes,
                    },
                });
            }
            console.log("Completed updating course count!");
        }
        catch (error) {
            console.log("Error updating course count: " + error.message || "unknown error");
            throw error;
        }
    });
}
function generateUserCreateInputArray(total, role) {
    try {
        const users = [];
        for (let index = 0; index < total; index++) {
            const userObject = {
                email: faker_1.faker.internet.email(),
                password: (0, encrypt_1.default)("password"),
                name: faker_1.faker.internet.displayName(),
                NIM: faker_1.faker.internet.port().toString(),
                role,
            };
            users.push(userObject);
        }
        return users;
    }
    catch (error) {
        console.log("Failed creating user create input array!");
        throw error;
    }
}
function insertUsers(total, role) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let count = 0;
            if (total > 100) {
                for (let i = 0; i < Math.floor(total / 100); i++) {
                    const returnObj = yield userTable.createMany({
                        data: generateUserCreateInputArray(total, role),
                        skipDuplicates: true,
                    });
                    count += returnObj.count;
                }
            }
            const returnObj = yield userTable.createMany({
                data: generateUserCreateInputArray(total > 100 ? total % 100 : total, role),
                skipDuplicates: true,
            });
            count += returnObj.count;
            console.log("Completed inserting " + count + " users to the database!");
            return {
                count,
            };
        }
        catch (error) {
            console.log("Failed inserting ".concat(role, "s!"));
            throw error;
        }
    });
}
function updateUserCount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let count = 0;
            let myCursor = -1;
            let user;
            const { id: maxId } = yield userTable.findFirstOrThrow({
                orderBy: {
                    id: "desc",
                },
                select: { id: true },
            });
            while (myCursor < maxId) {
                let totalLessons = 0;
                let totalCourses = 0;
                const users = yield userTable.findMany({
                    skip: myCursor === -1 ? undefined : 1,
                    take: 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    select: {
                        id: true,
                    },
                });
                user = users[0];
                myCursor = user.id;
                const courseEnrollments = yield courseEnrollmentTable.findMany({
                    where: {
                        userId: user.id,
                    },
                    select: {
                        courseId: true,
                    },
                });
                for (let i = 0; i < courseEnrollments.length; i++) {
                    const course = yield courseTable.findUniqueOrThrow({
                        where: {
                            id: courseEnrollments[i].courseId,
                        },
                        select: {
                            totalLessons: true,
                        },
                    });
                    totalLessons += course.totalLessons;
                    totalCourses++;
                }
                yield userTable.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        totalCourses,
                        totalLessons,
                    },
                });
                count++;
            }
            console.log("Completed updating user count!");
        }
        catch (error) {
            console.log("Error updating user count: " + error.message || "unknown error");
            throw error;
        }
    });
}
function deleteAuthorEnrollment() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let myCursor = -1;
            let course;
            let count = 0;
            const { id: maxId } = yield courseTable.findFirstOrThrow({
                orderBy: {
                    id: "desc",
                },
                select: { id: true },
            });
            while (myCursor < maxId) {
                const courses = yield courseTable.findMany({
                    skip: myCursor === -1 ? 0 : 1,
                    take: 1,
                    cursor: myCursor === -1
                        ? undefined
                        : {
                            id: myCursor,
                        },
                    select: {
                        id: true,
                        authorId: true,
                    },
                });
                course = courses[0];
                myCursor = course.id;
                try {
                    const enrollment = yield courseEnrollmentTable.findUnique({
                        where: {
                            userId_courseId: {
                                userId: course.authorId,
                                courseId: course.id,
                            },
                        },
                    });
                    if (enrollment) {
                        yield courseEnrollmentTable.delete({
                            where: {
                                userId_courseId: {
                                    userId: course.authorId,
                                    courseId: course.id,
                                },
                            },
                        });
                    }
                    count++;
                }
                catch (error) {
                    console.log(count);
                    throw error;
                }
            }
            console.log("Completed deleting author enrollment!");
        }
        catch (error) {
            console.log("Error deleting author enrollment: " + error.message || "unknown error");
            throw error;
        }
    });
}
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield cleanTables();
        const TOTAL_STUDENT = 3;
        const TOTAL_INSTRUCTORS = 5;
        const TOTAL_ADMIN = 5;
        yield insertCourseCategories(10);
        yield insertUsers(TOTAL_STUDENT, client_1.Role.STUDENT);
        yield insertUsers(TOTAL_INSTRUCTORS, client_1.Role.INSTRUCTOR);
        yield insertUsers(TOTAL_ADMIN, client_1.Role.OWNER);
        yield insertCourses(1);
        yield insertCourseEnrollments(2);
        yield insertLessons(2);
        yield insertVideos(2);
        yield updateUserCount();
        yield deleteAuthorEnrollment();
        yield insertCourseLikes();
        yield updateCourseCount();
    });
}
exports.default = seed;
