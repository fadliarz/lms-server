"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lesson_type_1 = require("../lesson.type");
const course_type_1 = require("../../course/course.type");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
var Fail;
(function (Fail) {
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
})(Fail || (Fail = {}));
describe("CourseLessonAuthorization Test Suite", () => {
    let sut;
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(lesson_type_1.CourseLessonDITypes.AUTHORIZATION);
    });
    /**
     * Create
     *
     */
    describe("CreateLesson Authorization", () => {
        it.each([
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: null,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: null,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: null,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: true,
            },
        ])("", ({ name, role: { userRole, enrollmentRole }, isAuthorized, }) => {
            const user = {
                id: 1,
                role: userRole,
            };
            const course = {
                authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
            };
            const enrollment = (enrollmentRole === null || enrollmentRole === "AUTHOR"
                ? null
                : {
                    role: enrollmentRole,
                });
            try {
                sut.authorizeCreateLesson(user, course, enrollment);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                console.log(error);
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
    /**
     * Update
     *
     */
    describe("UpdateLesson Authorization", () => {
        it.each([
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: null,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: null,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: null,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: true,
            },
        ])("", ({ name, role: { userRole, enrollmentRole }, isAuthorized, }) => {
            const user = {
                id: 1,
                role: userRole,
            };
            const course = {
                authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
            };
            const enrollment = (enrollmentRole === null || enrollmentRole === "AUTHOR"
                ? null
                : {
                    role: enrollmentRole,
                });
            try {
                sut.authorizeUpdateLesson(user, course, enrollment);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                console.log(error);
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
    /**
     * Delete
     *
     */
    describe("DeleteLesson Authorization", () => {
        it.each([
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: null,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: null,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: null,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: true,
            },
        ])("", ({ name, role: { userRole, enrollmentRole }, isAuthorized, }) => {
            const user = {
                id: 1,
                role: userRole,
            };
            const course = {
                authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
            };
            const enrollment = (enrollmentRole === null || enrollmentRole === "AUTHOR"
                ? null
                : {
                    role: enrollmentRole,
                });
            try {
                sut.authorizeDeleteLesson(user, course, enrollment);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                console.log(error);
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
});
