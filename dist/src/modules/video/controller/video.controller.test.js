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
const video_type_1 = require("../video.type");
const video_service_1 = require("../service/video.service");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const video_joi_1 = require("./video.joi");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const mockCreateVideo = jest.fn();
const mockGetVideoById = jest.fn();
const mockUpdateVideoSource = jest.fn();
const mockDeleteVideo = jest.fn();
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
describe("CourseLessonVideoController Test Suites", () => {
    let sut;
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(video_type_1.CourseLessonVideoDITypes.SERVICE);
        inversifyConfig_1.default
            .bind(video_type_1.CourseLessonVideoDITypes.SERVICE)
            .toConstantValue({
            createVideo: mockCreateVideo,
            getVideoById: mockGetVideoById,
            updateVideoSource: mockUpdateVideoSource,
            deleteVideo: mockDeleteVideo,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(video_type_1.CourseLessonVideoDITypes.SERVICE);
        inversifyConfig_1.default
            .bind(video_type_1.CourseLessonVideoDITypes.SERVICE)
            .to(video_service_1.CourseLessonVideoService);
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
        sut = inversifyConfig_1.default.get(video_type_1.CourseLessonVideoDITypes.CONTROLLER);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("", () => {
        it("createVideo", () => __awaiter(void 0, void 0, void 0, function* () {
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
            const createdVideo = {};
            mockCreateVideo.mockReturnValueOnce(createdVideo);
            /**
             * Act
             *
             */
            yield sut.createVideo(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).toBeCalledTimes(1);
            expect(validateJoi_1.default).toBeCalledWith({ body: video_joi_1.CreateCourseLessonVideoJoi });
            expect(mockCreateVideo).toBeCalledTimes(1);
            expect(mockCreateVideo).toReturnWith(createdVideo);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.RESOURCE_CREATED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: createdVideo });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                        lessonId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
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
                yield sut.createVideo(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).toBeCalledTimes(1);
                expect(validateJoi_1.default).toBeCalledWith({
                    body: video_joi_1.CreateCourseLessonVideoJoi,
                });
                expect(mockCreateVideo).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
    describe("getVideoById", () => {
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
                videoId: "1",
            };
            const video = {};
            mockGetVideoById.mockReturnValueOnce(video);
            /**
             * Act
             *
             */
            yield sut.getVideoById(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).not.toBeCalled();
            expect(mockGetVideoById).toBeCalledTimes(1);
            expect(mockGetVideoById).toReturnWith(video);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: video });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                        lessonId: "1",
                        videoId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                        videoId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "1",
                        videoId: "NaN",
                    },
                    exception: new NaNException_1.default("videoId"),
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
                yield sut.getVideoById(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).not.toBeCalled();
                expect(mockGetVideoById).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
    describe("updateVideo", () => {
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
                videoId: "1",
            };
            const updatedVideo = {};
            mockUpdateVideoSource.mockReturnValueOnce(updatedVideo);
            /**
             * Act
             *
             */
            yield sut.updateVideoSource(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).toBeCalledTimes(1);
            expect(validateJoi_1.default).toBeCalledWith({
                body: video_joi_1.UpdateCourseLessonVideoSourceJoi,
            });
            expect(mockUpdateVideoSource).toBeCalledTimes(1);
            expect(mockUpdateVideoSource).toReturnWith(updatedVideo);
            expect(mockNext).not.toBeCalledWith();
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(statusCode_1.StatusCode.SUCCESS);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({ data: updatedVideo });
        }));
        {
            it.each([
                {
                    name: "",
                    params: {
                        courseId: "NaN",
                        lessonId: "1",
                        videoId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                        videoId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "1",
                        videoId: "NaN",
                    },
                    exception: new NaNException_1.default("videoId"),
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
                yield sut.updateVideoSource(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).toBeCalledTimes(1);
                expect(validateJoi_1.default).toBeCalledWith({
                    body: video_joi_1.UpdateCourseLessonVideoSourceJoi,
                });
                expect(mockUpdateVideoSource).not.toBeCalled();
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
                videoId: "1",
            };
            mockDeleteVideo.mockReturnValueOnce({});
            /**
             * Act
             *
             */
            yield sut.deleteVideo(mockRequest, mockResponse, mockNext);
            /**
             * Assert
             *
             */
            expect(validateJoi_1.default).not.toBeCalled();
            expect(mockDeleteVideo).toBeCalledTimes(1);
            expect(mockDeleteVideo).toReturnWith({});
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
                        courseId: "NaN",
                        lessonId: "1",
                        videoId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "NaN",
                        videoId: "1",
                    },
                    exception: new NaNException_1.default("courseId || lessonId"),
                },
                {
                    name: "",
                    params: {
                        courseId: "1",
                        lessonId: "1",
                        videoId: "NaN",
                    },
                    exception: new NaNException_1.default("videoId"),
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
                yield sut.deleteVideo(mockRequest, mockResponse, mockNext);
                /**
                 * Assert
                 *
                 */
                expect(validateJoi_1.default).not.toBeCalled();
                expect(mockDeleteVideo).not.toBeCalled();
                expect(mockNext).toBeCalledTimes(1);
                expect(mockNext.mock.calls[0][0]).toEqual(exception);
                expect(mockNext).toBeCalledWith(mockNext.mock.calls[0][0]);
                expect(mockResponse.status).not.toBeCalled();
                expect(mockResponse.json).not.toBeCalled();
            }));
        }
    });
});
