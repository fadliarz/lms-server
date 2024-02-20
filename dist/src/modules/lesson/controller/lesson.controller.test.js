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
const ValidateJoiModule = __importStar(require("../../../common/functions/validateJoi"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const lesson_type_1 = require("../lesson.type");
const lesson_service_1 = require("../service/lesson.service");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const lesson_joi_1 = require("./lesson.joi");
const statusCode_1 = require("../../../common/constants/statusCode");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const mockCreateLesson = jest.fn();
const mockGetLessonById = jest.fn();
const mockUpdateLesson = jest.fn();
const mockDeleteLesson = jest.fn();
var Fail;
(function (Fail) {
    Fail["SHOULD_THROW_AN_ERROR"] = "Should throw an error!";
    Fail["SHOULD_NOT_THROW_AN_ERROR"] = "Should not throw an error";
})(Fail || (Fail = {}));
function mockValidateJoiOnce() {
    jest.spyOn(ValidateJoiModule, "default").mockImplementationOnce(() => {
        return jest.fn();
    });
}
describe("CourseLessonController Test Suites", () => {
    let sut;
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(lesson_type_1.CourseLessonDITypes.SERVICE);
        inversifyConfig_1.default
            .bind(lesson_type_1.CourseLessonDITypes.SERVICE)
            .toConstantValue({
            createLesson: mockCreateLesson,
            getLessonById: mockGetLessonById,
            updateLesson: mockUpdateLesson,
            deleteLesson: mockDeleteLesson,
            validateRelationBetweenResources: jest.fn(),
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(lesson_type_1.CourseLessonDITypes.SERVICE);
        inversifyConfig_1.default
            .bind(lesson_type_1.CourseLessonDITypes.SERVICE)
            .to(lesson_service_1.CourseLessonService);
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
        sut = inversifyConfig_1.default.get(lesson_type_1.CourseLessonDITypes.CONTROLLER);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createLesson", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockValidateJoiOnce();
            mockRequest.user = {
                id: "1",
            };
            mockRequest.params = {
                courseId: "1",
            };
            const createdLesson = {};
            mockCreateLesson.mockReturnValueOnce(createdLesson);
            /**
             * Act
             *
             */
            yield sut.createLesson(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).toBeCalledTimes(1);
            expect(validateJoi_1.default).toBeCalledWith({ body: lesson_joi_1.CreateCourseLessonDtoJoi });
            expect(mockCreateLesson).toBeCalledTimes(1);
            expect(mockCreateLesson).toReturnWith(createdLesson);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.RESOURCE_CREATED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: createdLesson });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                    },
                    exception: new NaNException_1.default("courseId"),
                },
            ])("", ({ name, params, exception }) => __awaiter(void 0, void 0, void 0, function* () {
                /**
                 * Arrange
                 *
                 */
                mockValidateJoiOnce();
                mockRequest.user = {
                    id: "1",
                };
                mockRequest.params = params;
                /**
                 * Act
                 *
                 */
                yield sut.createLesson(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).toBeCalledTimes(1);
                expect(validateJoi_1.default).toBeCalledWith({
                    body: lesson_joi_1.CreateCourseLessonDtoJoi,
                });
                expect(mockCreateLesson).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
    describe("getLessonById", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockValidateJoiOnce();
            mockRequest.params = {
                courseId: "1",
                lessonId: "1",
            };
            const lesson = {};
            mockGetLessonById.mockReturnValueOnce(lesson);
            /**
             * Act
             *
             */
            yield sut.getLessonById(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).not.toBeCalled();
            expect(mockGetLessonById).toBeCalledTimes(1);
            expect(mockGetLessonById).toReturnWith(lesson);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: lesson });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                    },
                    exception: new NaNException_1.default("lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                        lessonId: "1",
                    },
                    exception: new NaNException_1.default("courseId"),
                },
            ])("", ({ name, params, exception }) => __awaiter(void 0, void 0, void 0, function* () {
                /**
                 * Arrange
                 *
                 */
                mockRequest.params = params;
                /**
                 * Act
                 *
                 */
                yield sut.getLessonById(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).not.toBeCalled();
                expect(mockGetLessonById).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
    describe("updateLesson", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockValidateJoiOnce();
            mockRequest.user = {
                id: "1",
            };
            mockRequest.params = {
                courseId: "1",
                lessonId: "1",
            };
            const updatedLesson = {};
            mockUpdateLesson.mockReturnValueOnce(updatedLesson);
            /**
             * Act
             *
             */
            yield sut.updateLesson(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).toBeCalledTimes(1);
            expect(validateJoi_1.default).toBeCalledWith({ body: lesson_joi_1.UpdateCourseLessonDtoJoi });
            expect(mockUpdateLesson).toBeCalledTimes(1);
            expect(mockUpdateLesson).toReturnWith(updatedLesson);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: updatedLesson });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                    },
                    exception: new NaNException_1.default("lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                        lessonId: "1",
                    },
                    exception: new NaNException_1.default("courseId"),
                },
            ])("", ({ name, params, exception }) => __awaiter(void 0, void 0, void 0, function* () {
                /**
                 * Arrange
                 *
                 */
                mockValidateJoiOnce();
                mockRequest.user = {
                    id: "1",
                };
                mockRequest.params = params;
                /**
                 * Act
                 *
                 */
                yield sut.updateLesson(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).toBeCalledTimes(1);
                expect(validateJoi_1.default).toBeCalledWith({
                    body: lesson_joi_1.UpdateCourseLessonDtoJoi,
                });
                expect(mockUpdateLesson).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
    describe("deleteLesson", () => {
        it("", () => __awaiter(void 0, void 0, void 0, function* () {
            /**
             * Arrange
             *
             */
            mockRequest.user = {
                id: "1",
            };
            mockRequest.params = {
                courseId: "1",
                lessonId: "1",
            };
            mockDeleteLesson.mockReturnValueOnce({});
            /**
             * Act
             *
             */
            yield sut.deleteLesson(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).not.toBeCalled();
            expect(mockDeleteLesson).toBeCalledTimes(1);
            expect(mockDeleteLesson).toReturnWith({});
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: {} });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                    },
                    exception: new NaNException_1.default("lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                        lessonId: "1",
                    },
                    exception: new NaNException_1.default("courseId"),
                },
            ])("", ({ name, params, exception }) => __awaiter(void 0, void 0, void 0, function* () {
                /**
                 * Arrange
                 *
                 */
                mockRequest.user = {
                    id: "1",
                };
                mockRequest.params = params;
                /**
                 * Act
                 *
                 */
                yield sut.deleteLesson(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).not.toBeCalled();
                expect(mockDeleteLesson).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
});
