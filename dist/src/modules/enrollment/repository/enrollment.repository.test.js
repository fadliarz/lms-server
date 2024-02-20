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
require("reflect-metadata");
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const PrismaTable_1 = require("../../../common/class/table/PrismaTable");
const enrollment_type_1 = require("../enrollment.type");
const course_type_1 = require("../../course/course.type");
const client_1 = require("@prisma/client");
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const rand_type_1 = require("../../../common/class/randprisma/rand.type");
const InternalServerException_1 = __importDefault(require("../../../common/class/exceptions/InternalServerException"));
const isEqualOrIncludeCourseEnrollmentRole_1 = __importDefault(require("../../../common/functions/isEqualOrIncludeCourseEnrollmentRole"));
var Fail;
(function (Fail) {
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
})(Fail || (Fail = {}));
/**
 * Authorization mock function
 *
 */
const mockAuthorizeCreateEnrollment = jest.fn();
const mockAuthorizeUpdateEnrollmentRole = jest.fn();
const mockAuthorizeDeleteEnrollment = jest.fn();
describe("CourseLessonVideoRepository Test Suite", () => {
    let sut;
    let rand;
    let table;
    beforeAll(() => {
        rand = inversifyConfig_1.default.get(rand_type_1.PrismaRandDBDITypes.FACADE);
        table = inversifyConfig_1.default.get(PrismaTable_1.PrismaTableDITypes.TABLE);
        inversifyConfig_1.default.unbind(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION);
        inversifyConfig_1.default
            .bind(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION)
            .toConstantValue({
            authorizeCreateEnrollment: mockAuthorizeCreateEnrollment,
            authorizeUpdateEnrollmentRole: mockAuthorizeUpdateEnrollmentRole,
            authorizeDeleteEnrollment: mockAuthorizeDeleteEnrollment,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION);
        inversifyConfig_1.default.bind(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(enrollment_type_1.CourseEnrollmentDITypes.REPOSITORY);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("CourseEnrollment Test Suite", () => {
        describe.only("createEnrollment", () => {
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: client_1.CourseEnrollmentRole.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: client_1.CourseEnrollmentRole.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: client_1.CourseEnrollmentRole.INSTRUCTOR,
                },
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: client_1.CourseEnrollmentRole.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: client_1.CourseEnrollmentRole.INSTRUCTOR,
                },
            ])("", ({ userRole, enrollmentRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const { author, course } = yield rand.course.generateOne(course_type_1.UserRoleModel.INSTRUCTOR);
                const userToBeEnrolled = yield rand.user.generateOne(course_type_1.UserRoleModel.STUDENT);
                const resourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const dto = {
                    userId: userToBeEnrolled.id,
                    role: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                };
                let createdEnrollment;
                createdEnrollment =
                    yield table.courseEnrollment.findUniqueByUserIdAndCourseId(userToBeEnrolled.id, course.id);
                expect(createdEnrollment).toBeNull();
                const actual = yield sut.createEnrollment(resourceId, dto);
                const expected = yield table.courseEnrollment.findUniqueByUserIdAndCourseIdOrThrow(dto.userId, course.id);
                expect(expected).toBeDefined();
                expect(expected).toEqual(actual);
            }));
            /**
             * sad path
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: client_1.CourseEnrollmentRole.INSTRUCTOR,
                },
            ])("", ({ userRole, enrollmentRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const { author, course } = yield rand.course.generateOne(course_type_1.UserRoleModel.INSTRUCTOR);
                const userToBeEnrolled = yield rand.user.generateOne(course_type_1.UserRoleModel.STUDENT);
                const resourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const dto = {
                    userId: userToBeEnrolled.id,
                    role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                };
                let createdEnrollment;
                createdEnrollment =
                    yield table.courseEnrollment.findUniqueByUserIdAndCourseId(userToBeEnrolled.id, course.id);
                expect(createdEnrollment).toBeNull();
                expect(sut.createEnrollment(resourceId, dto)).rejects.toThrow(ClientException_1.default);
                const expected = yield table.courseEnrollment.findUniqueByUserIdAndCourseId(dto.userId, course.id);
                expect(expected).toBeNull();
            }));
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                },
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                },
            ])(`[userRole: $userRole; <Author>]: shouldn't create an enrollment`, ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const { author, course } = yield rand.course.generateOne(course_type_1.UserRoleModel.INSTRUCTOR);
                const resourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const dto = {
                    userId: author.id,
                    role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                };
                let createdEnrollment;
                createdEnrollment =
                    yield table.courseEnrollment.findUniqueByUserIdAndCourseId(author.id, course.id);
                expect(createdEnrollment).toBeNull();
                expect(sut.createEnrollment(resourceId, dto)).rejects.toThrow(ClientException_1.default);
                const expected = yield table.courseEnrollment.findUniqueByUserIdAndCourseId(dto.userId, course.id);
                expect(expected).toBeNull();
            }));
            /**
             * Edge path
             *
             */
        });
        describe.only("updateEnrollment", () => {
            it.each([
                {
                    targetUserRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    exception: new ClientException_1.default(),
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    exception: new InternalServerException_1.default(),
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    exception: new InternalServerException_1.default(),
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                {
                    targetUserRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    newEnrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
            ])("", ({ targetUserRole, enrollmentRole, newEnrollmentRole, exception, }) => __awaiter(void 0, void 0, void 0, function* () {
                const { author, course, enrollment, category } = yield rand.courseEnrollment.generateOne({
                    authorUserRole: course_type_1.UserRoleModel.OWNER,
                    userRole: targetUserRole,
                    enrollmentRole: enrollmentRole,
                });
                const resourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                const dto = {
                    role: newEnrollmentRole,
                };
                let totalStudents = 0;
                let totalInstructors = 0;
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.STUDENT)) {
                    totalStudents = 1;
                }
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)) {
                    totalInstructors = 1;
                }
                expect(course.totalStudents).toEqual(totalStudents);
                expect(course.totalInstructors).toEqual(totalInstructors);
                try {
                    const actual = yield sut.updateEnrollmentRole(enrollment.id, resourceId, dto);
                    if (exception) {
                        fail(Fail.SHOULD_THROW_AN_ERROR);
                    }
                    const updatedEnrollment = yield table.courseEnrollment.findUniqueOrThrow(enrollment.id);
                    expect(updatedEnrollment.role).toEqual(dto.role);
                    expect(updatedEnrollment).toEqual(actual);
                    if (!(0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, dto.role)) {
                        if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(dto.role, course_type_1.CourseEnrollmentRoleModel.STUDENT)) {
                            totalStudents += 1;
                            totalInstructors += -1;
                        }
                        if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(dto.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)) {
                            totalStudents += -1;
                            totalInstructors += 1;
                        }
                    }
                    const updatedCourse = yield table.course.findUniqueOrThrow(course.id);
                    expect(updatedCourse.totalStudents).toEqual(totalStudents);
                    expect(updatedCourse.totalInstructors).toEqual(totalInstructors);
                }
                catch (error) {
                    if (!exception) {
                        console.log("error: ", error);
                        fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                    }
                    const updatedCourse = yield table.course.findUniqueOrThrow(course.id);
                    expect(updatedCourse).toEqual(course);
                    expect(error).toEqual(exception);
                }
            }));
        });
        describe.only("deleteEnrollment", () => {
            it.each([
                {
                    enrolledUserUserRole: course_type_1.UserRoleModel.STUDENT,
                    enrollment: {
                        role: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    },
                },
                {
                    enrolledUserUserRole: course_type_1.UserRoleModel.STUDENT,
                    enrollment: {
                        role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    },
                    exception: new InternalServerException_1.default(),
                },
                {
                    enrolledUserUserRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollment: {
                        role: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    },
                },
                {
                    enrolledUserUserRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollment: {
                        role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    },
                },
                {
                    enrolledUserUserRole: course_type_1.UserRoleModel.OWNER,
                    enrollment: {
                        role: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    },
                },
                {
                    enrolledUserUserRole: course_type_1.UserRoleModel.OWNER,
                    enrollment: {
                        role: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    },
                },
            ])("", ({ enrolledUserUserRole, enrollment: { role: enrollmentRole }, exception, }) => __awaiter(void 0, void 0, void 0, function* () {
                const { author, course, enrollment, category } = yield rand.courseEnrollment.generateOne({
                    authorUserRole: course_type_1.UserRoleModel.OWNER,
                    userRole: enrolledUserUserRole,
                    enrollmentRole: enrollmentRole,
                });
                const resourceId = {
                    userId: author.id,
                    courseId: course.id,
                };
                let totalStudents = 0;
                let totalInstructors = 0;
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.STUDENT)) {
                    totalStudents = 1;
                }
                if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollment.role, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)) {
                    totalInstructors = 1;
                }
                expect(course.totalStudents).toEqual(totalStudents);
                expect(course.totalInstructors).toEqual(totalInstructors);
                try {
                    const actual = yield sut.deleteEnrollment(enrollment.id, resourceId);
                    expect(actual).toEqual({});
                    if (exception) {
                        fail(Fail.SHOULD_THROW_AN_ERROR);
                    }
                    const deletedEnrollment = yield table.courseEnrollment.findUnique(enrollment.id);
                    expect(deletedEnrollment).toBeNull();
                    if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollmentRole, course_type_1.CourseEnrollmentRoleModel.STUDENT)) {
                        totalStudents = 0;
                    }
                    if ((0, isEqualOrIncludeCourseEnrollmentRole_1.default)(enrollmentRole, course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR)) {
                        totalInstructors = 0;
                    }
                    const updatedCourse = yield table.course.findUniqueOrThrow(course.id);
                    expect(updatedCourse.totalStudents).toEqual(totalStudents);
                    expect(updatedCourse.totalInstructors).toEqual(totalInstructors);
                }
                catch (error) {
                    if (!exception) {
                        console.log("error: ", error);
                        fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                    }
                    const updatedCourse = yield table.course.findUniqueOrThrow(course.id);
                    expect(updatedCourse).toEqual(course);
                    expect(error).toEqual(exception);
                }
            }));
        });
    });
});
