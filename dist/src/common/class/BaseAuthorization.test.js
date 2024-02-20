"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const course_type_1 = require("../../modules/course/course.type");
const InternalServerException_1 = __importDefault(require("./exceptions/InternalServerException"));
const BaseAuthorization_1 = require("./BaseAuthorization");
const inversifyConfig_1 = __importDefault(require("../../inversifyConfig"));
const prisma_query_raw_type_1 = require("./prisma_query_raw/prisma_query_raw.type");
const UserPrismaQueryRaw_1 = __importDefault(require("./prisma_query_raw/UserPrismaQueryRaw"));
const GetRoleStatusModel = __importStar(require("../functions/getRoleStatus"));
const CoursePrismaQueryRaw_1 = __importDefault(require("./prisma_query_raw/CoursePrismaQueryRaw"));
const CourseEnrollmentPrismaQueryRaw_1 = __importDefault(require("./prisma_query_raw/CourseEnrollmentPrismaQueryRaw"));
var Fail;
(function (Fail) {
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error";
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Shouldn't throw an error";
})(Fail || (Fail = {}));
function mockGetRoleStatusReturnValueOnce(returnValue) {
    jest.spyOn(GetRoleStatusModel, "default").mockReturnValueOnce(returnValue);
}
const mockUserSelectForUpdateByIdOrThrow = jest.fn();
const mockCourseSelectForUpdateByIdOrThrow = jest.fn();
const mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId = jest.fn();
describe("BaseAuthorizaion Test Suites", () => {
    let sut;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(prisma_query_raw_type_1.PrismaQueryRawDITypes.USER);
        inversifyConfig_1.default
            .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.USER)
            .toConstantValue({
            selectForUpdateByIdOrThrow: mockUserSelectForUpdateByIdOrThrow,
        });
        inversifyConfig_1.default.unbind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE);
        inversifyConfig_1.default
            .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE)
            .toConstantValue({
            selectForUpdateByIdOrThrow: mockCourseSelectForUpdateByIdOrThrow,
        });
        inversifyConfig_1.default.unbind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_ENROLLMENT);
        inversifyConfig_1.default
            .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_ENROLLMENT)
            .toConstantValue({
            selectForUpdateByUserIdAndCourseId: mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(prisma_query_raw_type_1.PrismaQueryRawDITypes.USER);
        inversifyConfig_1.default
            .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.USER)
            .to(UserPrismaQueryRaw_1.default);
        inversifyConfig_1.default.unbind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE);
        inversifyConfig_1.default
            .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE)
            .to(CoursePrismaQueryRaw_1.default);
        inversifyConfig_1.default.unbind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_ENROLLMENT);
        inversifyConfig_1.default
            .bind(prisma_query_raw_type_1.PrismaQueryRawDITypes.COURSE_ENROLLMENT)
            .to(CourseEnrollmentPrismaQueryRaw_1.default);
    });
    beforeEach(() => {
        sut = inversifyConfig_1.default.get(BaseAuthorization_1.BaseAuthorizationDITypes);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("authorizeUserRole", () => {
        {
            it.each([
                { isStudent: true, isInstructor: false, isAdmin: false },
                { isStudent: false, isInstructor: true, isAdmin: false },
                { isStudent: false, isInstructor: false, isAdmin: true },
            ])("", (tc) => __awaiter(void 0, void 0, void 0, function* () {
                const user = {};
                mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
                const func = jest.fn();
                mockGetRoleStatusReturnValueOnce(tc);
                try {
                    const actual = yield sut.authorizeUserRole({}, {}, func);
                    expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
                    expect(func).toBeCalledTimes(1);
                    expect(user).toEqual(actual);
                }
                catch (error) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
            }));
        }
        {
            it.each([
                { isStudent: false, isInstructor: false, isAdmin: false },
            ])("", (tc) => __awaiter(void 0, void 0, void 0, function* () {
                const func = jest.fn();
                const user = {};
                mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
                mockGetRoleStatusReturnValueOnce(tc);
                try {
                    yield sut.authorizeUserRole({}, {}, func);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
                    expect(func).not.toBeCalled();
                    expect(error).toBeInstanceOf(InternalServerException_1.default);
                }
            }));
        }
    });
    describe("authorize", () => {
        {
            it.each([
                { isStudent: true, isInstructor: false, isAdmin: false },
                { isStudent: false, isInstructor: true, isAdmin: false },
                { isStudent: false, isInstructor: false, isAdmin: true },
            ])("", (tc) => __awaiter(void 0, void 0, void 0, function* () {
                const user = {};
                const course = {};
                const enrollment = {};
                mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
                mockCourseSelectForUpdateByIdOrThrow.mockReturnValueOnce(course);
                mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId.mockReturnValueOnce(enrollment);
                const func = jest.fn();
                mockGetRoleStatusReturnValueOnce(tc);
                try {
                    const actual = yield sut.authorize({}, {}, func);
                    expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
                    expect(mockCourseSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
                    expect(mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId).toBeCalledTimes(1);
                    expect(func).toBeCalledTimes(1);
                    expect({ user, course, enrollment }).toEqual(actual);
                }
                catch (error) {
                    fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
                }
            }));
        }
        {
            it.each([
                { isStudent: false, isInstructor: false, isAdmin: false },
            ])("", (tc) => __awaiter(void 0, void 0, void 0, function* () {
                const user = {};
                const course = {};
                const enrollment = {};
                mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
                mockCourseSelectForUpdateByIdOrThrow.mockReturnValueOnce(course);
                mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId.mockReturnValueOnce(enrollment);
                const func = jest.fn();
                mockGetRoleStatusReturnValueOnce(tc);
                try {
                    yield sut.authorize({}, {}, func);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
                    expect(mockCourseSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
                    expect(mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId).toBeCalledTimes(1);
                    expect(func).not.toBeCalled();
                    expect(error).toBeInstanceOf(InternalServerException_1.default);
                }
            }));
        }
    });
    describe("validateUnexpectedScenarios", () => {
        {
            it.each([
                {
                    name: "",
                    role: {
                        userRole: course_type_1.UserRoleModel.STUDENT,
                        enrollmentRole: course_type_1.CourseEnrollmentRoleModel.INSTRUCTOR,
                    },
                    isAuthor: false,
                },
                {
                    name: "",
                    role: {
                        userRole: course_type_1.UserRoleModel.STUDENT,
                        enrollmentRole: null,
                    },
                    isAuthor: true,
                },
                {
                    name: "",
                    role: {
                        userRole: course_type_1.UserRoleModel.INSTRUCTOR,
                        enrollmentRole: course_type_1.CourseEnrollmentRoleModel.STUDENT,
                    },
                    isAuthor: true,
                },
            ])("", ({ name, role: { userRole, enrollmentRole }, isAuthor }) => {
                const user = {
                    id: 1,
                    role: userRole,
                };
                const course = {
                    authorId: isAuthor ? user.id : user.id + 1,
                };
                const enrollment = (enrollmentRole === null
                    ? null
                    : {
                        role: enrollmentRole,
                    });
                try {
                    sut.validateUnexpectedScenarios(user, course, enrollment);
                    fail(Fail.SHOULD_THROW_AN_ERROR);
                }
                catch (error) {
                    expect(error).toBeInstanceOf(InternalServerException_1.default);
                }
            });
            {
                it.each([
                    { isStudent: false, isInstructor: false, isAdmin: false },
                ])("", (tc) => __awaiter(void 0, void 0, void 0, function* () {
                    mockGetRoleStatusReturnValueOnce(tc);
                    try {
                        sut.validateUnexpectedScenarios("", "", "");
                        fail(Fail.SHOULD_THROW_AN_ERROR);
                    }
                    catch (error) {
                        expect(error).toBeInstanceOf(InternalServerException_1.default);
                    }
                }));
            }
        }
    });
});
