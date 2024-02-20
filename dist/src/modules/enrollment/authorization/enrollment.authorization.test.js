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
const enrollment_type_1 = require("../enrollment.type");
const course_type_1 = require("../../course/course.type");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const InternalServerException_1 = __importDefault(require("../../../common/class/exceptions/InternalServerException"));
var Fail;
(function (Fail) {
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
})(Fail || (Fail = {}));
describe("CourseEnrolmentAuthorization Test Suite", () => {
    let sut;
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(enrollment_type_1.CourseEnrollmentDITypes.AUTHORIZATION);
    });
    describe("authorizeCreateEnrollment", () => {
        describe("enrolling for themselves", () => {
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
            ])("[userRole: $userRole, enrollmentRole: $enrollmentRole]: should create an enrollment", ({ userRole, enrollmentRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id + 1,
                };
                const dto = {
                    userId: enroller.id,
                    role: enrollmentRole,
                };
                try {
                    expect(enroller.id).toEqual(dto.userId);
                    expect(enroller.id).not.toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                }
                catch (error) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
            }));
            /**
             * Sad cases
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                    enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                },
            ])("[userRole: $userRole, enrollmentRole: $enrollmentRole]: shouldn't create an enrollment", ({ userRole, enrollmentRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id + 1,
                };
                const dto = {
                    userId: enroller.id,
                    role: enrollmentRole,
                };
                try {
                    expect(enroller.id).toEqual(dto.userId);
                    expect(enroller.id).not.toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(error).toEqual(expect.any(AuthorizationException_1.default));
                }
            }));
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                },
            ])("[userRole: $userRole <Author>]: shouldn't create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id,
                };
                const dto = {
                    userId: enroller.id,
                };
                try {
                    expect(enroller.id).toEqual(dto.userId);
                    expect(enroller.id).toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(error).toEqual(expect.any(InternalServerException_1.default));
                }
            }));
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                },
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                },
            ])("[userRole: $userRole <Author>]: shouldn't create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id,
                };
                const dto = {
                    userId: enroller.id,
                };
                try {
                    expect(enroller.id).toEqual(dto.userId);
                    expect(enroller.id).toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                    fail("should throw error");
                }
                catch (error) {
                    expect(error).toEqual(expect.any(AuthorizationException_1.default));
                }
            }));
        });
        describe("enrolling for others", () => {
            /**
             * Sad cases - Unauthorized - Non Author
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                },
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                },
            ])("[userRole: $userRole]: shouldn't create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id + 1,
                };
                const dto = {
                    userId: enroller.id + 2,
                };
                try {
                    expect(enroller.id).not.toEqual(dto.userId);
                    expect(enroller.id).not.toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(error).toEqual(expect.any(AuthorizationException_1.default));
                }
            }));
            /**
             * Sad cases - Unauthorized - Author
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                },
            ])("[userRole: $userRole <Author>]: shouldn't create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id,
                };
                const dto = {
                    userId: enroller.id + 1,
                };
                try {
                    expect(enroller.id).not.toEqual(dto.userId);
                    expect(enroller.id).toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(error).toEqual(expect.any(AuthorizationException_1.default));
                }
            }));
            /**
             * Sad cases - InternalServerException
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.STUDENT,
                },
            ])("[userRole: $userRole <Author>]: shouldn't create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id,
                };
                const dto = {
                    userId: enroller.id + 1,
                };
                try {
                    expect(enroller.id).not.toEqual(dto.userId);
                    expect(enroller.id).toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(error).toEqual(expect.any(InternalServerException_1.default));
                }
            }));
            /**
             * Happy cases - Non Author
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                },
            ])("[userRole: $userRole <Author>]: should create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id + 1,
                };
                const dto = {
                    userId: enroller.id + 2,
                };
                try {
                    expect(enroller.id).not.toEqual(dto.userId);
                    expect(enroller.id).not.toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                }
                catch (error) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
            }));
            /**
             * Happy cases - Author
             *
             */
            it.each([
                {
                    userRole: course_type_1.UserRoleModel.OWNER,
                },
            ])("[userRole: $userRole <Author>]: should create an enrollment", ({ userRole }) => __awaiter(void 0, void 0, void 0, function* () {
                const enroller = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: enroller.id,
                };
                const dto = {
                    userId: enroller.id + 1,
                };
                try {
                    expect(enroller.id).not.toEqual(dto.userId);
                    expect(enroller.id).toEqual(course.authorId);
                    yield sut.authorizeCreateEnrollment(enroller, course, dto);
                }
                catch (error) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
            }));
        });
    });
    describe("authorizeUpdateEnrollment", () => {
        it.each([
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: false,
                isUpdatingForOther: false,
                exception: new AuthorizationException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: false,
                isUpdatingForOther: true,
                exception: new AuthorizationException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: true,
                isUpdatingForOther: false,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: true,
                isUpdatingForOther: true,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: false,
                isUpdatingForOther: false,
                exception: new AuthorizationException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: false,
                isUpdatingForOther: true,
                exception: new AuthorizationException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: true,
                isUpdatingForOther: false,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: true,
                isUpdatingForOther: true,
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: false,
                isUpdatingForOther: false,
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: false,
                isUpdatingForOther: true,
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: true,
                isUpdatingForOther: false,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: true,
                isUpdatingForOther: true,
            },
        ])(`[userRole: $userRole${"$isAuthor" === true ? " <Author>]" : "]"}`, ({ userRole, isAuthor, isUpdatingForOther, exception, }) => __awaiter(void 0, void 0, void 0, function* () {
            const enroller = {
                id: 1,
                role: userRole,
            };
            const course = {
                authorId: isAuthor ? enroller.id : enroller.id + 1,
            };
            const enrollment = {
                userId: isUpdatingForOther ? enroller.id + 2 : enroller.id,
            };
            if (isAuthor) {
                expect(enroller.id).toEqual(course.authorId);
            }
            else {
                expect(enroller.id).not.toEqual(course.authorId);
            }
            if (isUpdatingForOther) {
                expect(enroller.id).not.toEqual(enrollment.userId);
            }
            else {
                expect(enroller.id).toEqual(enrollment.userId);
            }
            try {
                yield sut.authorizeUpdateEnrollmentRole(enroller, course, enrollment);
                if (exception) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (!exception) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                expect(error).toEqual(exception);
            }
        }));
    });
    describe("authorizeDeleteEnrollment", () => {
        it.each([
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: false,
                isDeletingForOther: false,
            },
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: false,
                isDeletingForOther: true,
                exception: new AuthorizationException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: true,
                isDeletingForOther: false,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.STUDENT,
                isAuthor: true,
                isDeletingForOther: true,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: false,
                isDeletingForOther: false,
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: false,
                isDeletingForOther: true,
                exception: new AuthorizationException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: true,
                isDeletingForOther: false,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                isAuthor: true,
                isDeletingForOther: true,
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: false,
                isDeletingForOther: false,
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: false,
                isDeletingForOther: true,
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: true,
                isDeletingForOther: false,
                exception: new InternalServerException_1.default(),
            },
            {
                userRole: course_type_1.UserRoleModel.OWNER,
                isAuthor: true,
                isDeletingForOther: true,
            },
        ])(`[userRole: $userRole${"$isAuthor" === true ? " <Author>]" : "]"}`, ({ userRole, isAuthor, isDeletingForOther, exception, }) => __awaiter(void 0, void 0, void 0, function* () {
            const enroller = {
                id: 1,
                role: userRole,
            };
            const course = {
                authorId: isAuthor ? enroller.id : enroller.id + 1,
            };
            const enrollment = {
                userId: isDeletingForOther ? enroller.id + 2 : enroller.id,
            };
            if (isAuthor) {
                expect(enroller.id).toEqual(course.authorId);
            }
            else {
                expect(enroller.id).not.toEqual(course.authorId);
            }
            if (isDeletingForOther) {
                expect(enroller.id).not.toEqual(enrollment.userId);
            }
            else {
                expect(enroller.id).toEqual(enrollment.userId);
            }
            try {
                yield sut.authorizeDeleteEnrollment(enroller, course, enrollment);
                if (exception) {
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
            }
            catch (error) {
                if (!exception) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
                expect(error).toEqual(exception);
            }
        }));
    });
});
