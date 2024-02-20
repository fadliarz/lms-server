"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const course_type_1 = require("../../course/course.type");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
var Fail;
(function (Fail) {
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
})(Fail || (Fail = {}));
describe("CourseAuthorization Test Suites", () => {
    let sut;
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(course_type_1.CourseDITypes.AUTHORIZATION);
    });
    /**
     * Create
     *
     */
    describe("CreateCourse Authorization", () => {
        it.each([
            {
                name: "",
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthorized: false,
            },
            {
                name: "",
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthorized: false,
            },
            {
                name: "",
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthorized: true,
            },
            {
                name: "",
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthorized: true,
            },
            {
                name: "",
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthorized: true,
            },
            {
                name: "",
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthorized: true,
            },
        ])("", ({ name, userRole, isAuthorized }) => {
            const user = {
                id: 1,
                role: userRole,
            };
            try {
                sut.authorizeCreateCourse(user);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
    /**
     * Update
     *
     */
    describe("UpdateCourse Authorization", () => {
        {
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
                    sut.authorizeUpdateBasicCourse(user, course, enrollment);
                    if (!isAuthorized) {
                        fail(Fail.SHOULD_THROW_AN_ERROR);
                    }
                }
                catch (error) {
                    if (isAuthorized) {
                        fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                    }
                    expect(error).toBeInstanceOf(AuthorizationException_1.default);
                }
            });
        }
    });
    /**
     * Delete
     *
     */
    describe("DeleteCourse Authorization", () => {
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
                isAuthorized: false,
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
                sut.authorizeDeleteCourse(user, course, enrollment);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
    /**
     * CreateLike
     *
     */
    describe("CreateLike Authorization", () => {
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
                isAuthorized: true,
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
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: null,
                },
                isAuthorized: false,
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
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: false,
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
                sut.authorizeCreateLike(user, course, enrollment);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
    /**
     * DeleteLike
     *
     */
    describe("DeleteLike Authorization", () => {
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
                isAuthorized: true,
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
                isAuthorized: true,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: null,
                },
                isAuthorized: false,
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
                isAuthorized: false,
            },
            {
                name: "",
                role: {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: "AUTHOR",
                },
                isAuthorized: false,
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
                sut.authorizeDeleteLike(user, course, enrollment);
                if (!isAuthorized) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (isAuthorized) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                expect(error).toBeInstanceOf(AuthorizationException_1.default);
            }
        });
    });
});
