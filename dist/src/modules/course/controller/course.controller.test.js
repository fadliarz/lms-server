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
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const course_type_1 = require("../course.type");
const course_service_1 = require("../service/course.service");
const statusCode_1 = require("../../../common/constants/statusCode");
const AuthenticationException_1 = __importDefault(require("../../../common/class/exceptions/AuthenticationException"));
const ValidateJoiModule = __importStar(require("../../../common/functions/validateJoi"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const mockCreateCourse = jest.fn();
const mockGetCourseById = jest.fn();
const mockUpdateBasicCourse = jest.fn();
const mockDeleteCourse = jest.fn();
const mockCreateLike = jest.fn();
const mockDeleteLike = jest.fn();
function constructJoiErrorMessageOnMissingRequiredField(field) {
    return `"${field}" is required`;
}
function mockValidateJoiOnce() {
    jest.spyOn(ValidateJoiModule, "default").mockImplementationOnce(() => {
        return jest.fn();
    });
}
describe("CourseController Test Suites", () => {
    let sut;
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(course_type_1.CourseDITypes.SERVICE);
        inversifyConfig_1.default.bind(course_type_1.CourseDITypes.SERVICE).toConstantValue({
            createCourse: mockCreateCourse,
            getCourseById: mockGetCourseById,
            updateBasicCourse: mockUpdateBasicCourse,
            deleteCourse: mockDeleteCourse,
            createLike: mockCreateLike,
            deleteLike: mockDeleteLike,
            validateRelationBetweenResources: jest.fn(),
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(course_type_1.CourseDITypes.SERVICE);
        inversifyConfig_1.default.bind(course_type_1.CourseDITypes.SERVICE).to(course_service_1.CourseService);
    });
    beforeEach(() => {
        mockRequest = {
            body: {},
            query: {},
        };
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        sut = inversifyConfig_1.default.get(course_type_1.CourseDITypes.CONTROLLER);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createCourse", () => {
        it("missing userId: throw AuthenticationException", () => __awaiter(void 0, void 0, void 0, function* () {
            mockValidateJoiOnce();
            yield sut.createCourse(mockRequest, mockResponse, mockNext);
            expect(mockCreateCourse).not.toBeCalledWith();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(AuthenticationException_1.default));
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
        }));
        it("userId is included: should create course", () => __awaiter(void 0, void 0, void 0, function* () {
            mockValidateJoiOnce();
            mockRequest.user = {
                id: 1,
            };
            const createdCourse = {};
            mockCreateCourse.mockReturnValueOnce(createdCourse);
            yield sut.createCourse(mockRequest, mockResponse, mockNext);
            expect(mockCreateCourse).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.RESOURCE_CREATED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: createdCourse });
        }));
    });
    describe("getCourseById", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockValidateJoiOnce();
            mockRequest.params = {
                courseId: "1",
            };
            mockRequest.user = {
                id: 1,
            };
            const course = {};
            mockGetCourseById.mockReturnValueOnce(course);
            yield sut.getCourseById(mockRequest, mockResponse, mockNext);
            expect(mockGetCourseById).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: course });
        }));
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockValidateJoiOnce();
            mockRequest.params = {
                courseId: "NaN",
            };
            mockRequest.user = {
                id: 1,
            };
            yield sut.getCourseById(mockRequest, mockResponse, mockNext);
            expect(mockGetCourseById).not.toBeCalled();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(NaNException_1.default));
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
        }));
    });
    describe("updateBasicCourse", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockValidateJoiOnce();
            mockRequest.params = {
                courseId: "1",
            };
            mockRequest.user = {
                id: 1,
            };
            const updatedCourse = {};
            mockUpdateBasicCourse.mockReturnValueOnce(updatedCourse);
            yield sut.updateBasicCourse(mockRequest, mockResponse, mockNext);
            expect(mockUpdateBasicCourse).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: updatedCourse });
        }));
    });
    describe("deleteCourse", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                courseId: "1",
            };
            mockRequest.user = {
                id: 1,
            };
            yield sut.deleteCourse(mockRequest, mockResponse, mockNext);
            expect(mockDeleteCourse).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
        }));
    });
    describe("createLike", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                courseId: "1",
            };
            mockRequest.user = {
                id: 1,
            };
            const createdLike = {};
            mockCreateLike.mockReturnValueOnce(createdLike);
            yield sut.createLike(mockRequest, mockResponse, mockNext);
            expect(mockCreateLike).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.RESOURCE_CREATED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: createdLike });
        }));
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                courseId: "NaN",
            };
            mockRequest.user = {
                id: 1,
            };
            yield sut.createLike(mockRequest, mockResponse, mockNext);
            expect(mockCreateLike).not.toBeCalledWith();
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(NaNException_1.default));
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
        }));
    });
    describe("deleteLike", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                courseId: "1",
                likeId: "1",
            };
            mockRequest.user = {
                id: 1,
            };
            yield sut.deleteLike(mockRequest, mockResponse, mockNext);
            expect(mockDeleteLike).toBeCalledTimes(1);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
        }));
    });
    it("", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRequest.params = {
            courseId: "1",
            likeId: "NaN",
        };
        mockRequest.user = {
            id: 1,
        };
        yield sut.deleteLike(mockRequest, mockResponse, mockNext);
        expect(mockDeleteLike).not.toBeCalledWith();
        expect(mockNext).toBeCalledTimes(1);
        expect(mockNext).toBeCalledWith(expect.any(NaNException_1.default));
        expect(mockResponse.status).not.toBeCalled();
        expect(mockResponse.json).not.toBeCalled();
    }));
});
