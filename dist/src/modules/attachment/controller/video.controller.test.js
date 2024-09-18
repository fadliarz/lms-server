"use strict";
// import * as ValidateJoiModule from "../../../common/functions/validateJoi";
// import validateJoi from "../../../common/functions/validateJoi";
// import { NextFunction, Request, Response } from "express";
// import dIContainer from "../../../inversifyConfig";
// import { CourseLessonVideoDITypes } from "../video.type";
// import {
//   CourseLessonVideoService,
//   ICourseLessonVideoService,
// } from "../service/video.service";
// import { ICourseLessonVideoController } from "./video.controller";
// import { StatusCode } from "../../../common/constants/statusCode";
// import {
//   CreateCourseLessonVideoJoi,
//   UpdateCourseLessonVideoSourceJoi,
// } from "./video.joi";
// import NaNException from "../../../common/class/exceptions/NaNException";
//
// const mockCreateVideo = jest.fn();
// const mockGetVideoById = jest.fn();
// const mockUpdateVideoSource = jest.fn();
// const mockDeleteVideo = jest.fn();
//
// enum Fail {
//   SHOULD_THROW_AN_ERROR = "Should throw an error!",
//   SHOULD_NOT_THROW_AN_ERROR = "Should not throw an error",
// }
//
// function mockValidateJoiOnce(): void {
//   jest.spyOn(ValidateJoiModule, "default").mockImplementationOnce(() => {
//     return jest.fn();
//   });
// }
//
// describe("CourseLessonVideoController Test Suites", () => {
//   let sut: ICourseLessonVideoController;
//   let mockRequest: Request;
//   let mockResponse: Response;
//   let mockNext: NextFunction;
//
//   beforeAll(() => {
//     dIContainer.unbind(CourseLessonVideoDITypes.SERVICE);
//     dIContainer
//       .bind<ICourseLessonVideoService>(CourseLessonVideoDITypes.SERVICE)
//       .toConstantValue({
//         createVideo: mockCreateVideo,
//         getVideoById: mockGetVideoById,
//         updateVideoSource: mockUpdateVideoSource,
//         deleteVideo: mockDeleteVideo,
//       });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseLessonVideoDITypes.SERVICE);
//     dIContainer
//       .bind<ICourseLessonVideoService>(CourseLessonVideoDITypes.SERVICE)
//       .to(CourseLessonVideoService);
//   });
//
//   beforeEach(() => {
//     mockRequest = {
//       body: {},
//       query: {},
//     } as Request;
//     mockResponse = {
//       status: jest.fn(() => mockResponse),
//       json: jest.fn(),
//     } as any as Response;
//     mockNext = jest.fn();
//     sut = dIContainer.get<ICourseLessonVideoController>(
//       CourseLessonVideoDITypes.CONTROLLER,
//     );
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("", () => {
//     it("createVideo", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockValidateJoiOnce();
//
//       (mockRequest as any).user = {
//         id: "1",
//       };
//       mockRequest.params = {
//         courseId: "1",
//         lessonId: "1",
//       };
//
//       const createdVideo = {};
//       mockCreateVideo.mockReturnValueOnce(createdVideo);
//
//       /**
//        * Act
//        *
//        */
//       await sut.createVideo(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).toBeCalledTimes(1);
//       expect(validateJoi).toBeCalledWith({ body: CreateCourseLessonVideoJoi });
//
//       expect(mockCreateVideo).toBeCalledTimes(1);
//       expect(mockCreateVideo).toReturnWith(createdVideo);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.RESOURCE_CREATED);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: createdVideo });
//     });
//
//     {
//       type TestCase = {
//         name: string;
//         params: {
//           courseId: string;
//           lessonId: string;
//         };
//         exception: Error;
//       };
//       it.each([
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "NaN",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//       ] satisfies TestCase[])(
//         "",
//         async ({ name, params, exception }: TestCase) => {
//           /**
//            * Arrange
//            *
//            */
//           mockValidateJoiOnce();
//
//           (mockRequest as any).user = {
//             id: "1",
//           };
//           mockRequest.params = params;
//
//           /**
//            * Act
//            *
//            */
//           await sut.createVideo(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).toBeCalledTimes(1);
//           expect(validateJoi).toBeCalledWith({
//             body: CreateCourseLessonVideoJoi,
//           });
//
//           expect(mockCreateVideo).not.toBeCalled();
//
//           expect(mockNext).toBeCalledTimes(1);
//           expect((mockNext as jest.Mock).mock.calls[0][0]).toEqual(exception);
//           expect(mockNext).toBeCalledWith(
//             (mockNext as jest.Mock).mock.calls[0][0],
//           );
//           expect(mockResponse.status).not.toBeCalled();
//           expect(mockResponse.json).not.toBeCalled();
//         },
//       );
//     }
//   });
//
//   describe("getVideoById", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockValidateJoiOnce();
//
//       (mockRequest as any).user = {
//         id: "1",
//       };
//       mockRequest.params = {
//         courseId: "1",
//         lessonId: "1",
//         videoId: "1",
//       };
//
//       const video = {};
//       mockGetVideoById.mockReturnValueOnce(video);
//
//       /**
//        * Act
//        *
//        */
//       await sut.getVideoById(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).not.toBeCalled();
//
//       expect(mockGetVideoById).toBeCalledTimes(1);
//       expect(mockGetVideoById).toReturnWith(video);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: video });
//     });
//
//     {
//       type TestCase = {
//         name: string;
//         params: {
//           courseId: string;
//           lessonId: string;
//           videoId: string;
//         };
//         exception: Error;
//       };
//       it.each([
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//             videoId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "NaN",
//             videoId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "1",
//             videoId: "NaN",
//           },
//           exception: new NaNException("videoId"),
//         },
//       ] satisfies TestCase[])(
//         "",
//         async ({ name, params, exception }: TestCase) => {
//           /**
//            * Arrange
//            *
//            */
//           (mockRequest as any).user = {
//             id: "1",
//           };
//           mockRequest.params = params;
//
//           /**
//            * Act
//            *
//            */
//           await sut.getVideoById(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).not.toBeCalled();
//
//           expect(mockGetVideoById).not.toBeCalled();
//
//           expect(mockNext).toBeCalledTimes(1);
//           expect((mockNext as jest.Mock).mock.calls[0][0]).toEqual(exception);
//           expect(mockNext).toBeCalledWith(
//             (mockNext as jest.Mock).mock.calls[0][0],
//           );
//           expect(mockResponse.status).not.toBeCalled();
//           expect(mockResponse.json).not.toBeCalled();
//         },
//       );
//     }
//   });
//
//   describe("updateVideo", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockValidateJoiOnce();
//
//       (mockRequest as any).user = {
//         id: "1",
//       };
//       mockRequest.params = {
//         courseId: "1",
//         lessonId: "1",
//         videoId: "1",
//       };
//
//       const updatedVideo = {};
//       mockUpdateVideoSource.mockReturnValueOnce(updatedVideo);
//
//       /**
//        * Act
//        *
//        */
//       await sut.updateVideoSource(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).toBeCalledTimes(1);
//       expect(validateJoi).toBeCalledWith({
//         body: UpdateCourseLessonVideoSourceJoi,
//       });
//
//       expect(mockUpdateVideoSource).toBeCalledTimes(1);
//       expect(mockUpdateVideoSource).toReturnWith(updatedVideo);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: updatedVideo });
//     });
//
//     {
//       type TestCase = {
//         name: string;
//         params: {
//           courseId: string;
//           lessonId: string;
//           videoId: string;
//         };
//         exception: Error;
//       };
//       it.each([
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//             videoId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "NaN",
//             videoId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "1",
//             videoId: "NaN",
//           },
//           exception: new NaNException("videoId"),
//         },
//       ] satisfies TestCase[])(
//         "",
//         async ({ name, params, exception }: TestCase) => {
//           /**
//            * Arrange
//            *
//            */
//           mockValidateJoiOnce();
//
//           (mockRequest as any).user = {
//             id: "1",
//           };
//           mockRequest.params = params;
//
//           /**
//            * Act
//            *
//            */
//           await sut.updateVideoSource(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).toBeCalledTimes(1);
//           expect(validateJoi).toBeCalledWith({
//             body: UpdateCourseLessonVideoSourceJoi,
//           });
//
//           expect(mockUpdateVideoSource).not.toBeCalled();
//
//           expect(mockNext).toBeCalledTimes(1);
//           expect((mockNext as jest.Mock).mock.calls[0][0]).toEqual(exception);
//           expect(mockNext).toBeCalledWith(
//             (mockNext as jest.Mock).mock.calls[0][0],
//           );
//           expect(mockResponse.status).not.toBeCalled();
//           expect(mockResponse.json).not.toBeCalled();
//         },
//       );
//     }
//   });
//
//   describe("deleteLesson", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       (mockRequest as any).user = {
//         id: "1",
//       };
//       mockRequest.params = {
//         courseId: "1",
//         lessonId: "1",
//         videoId: "1",
//       };
//
//       mockDeleteVideo.mockReturnValueOnce({});
//
//       /**
//        * Act
//        *
//        */
//       await sut.deleteVideo(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).not.toBeCalled();
//
//       expect(mockDeleteVideo).toBeCalledTimes(1);
//       expect(mockDeleteVideo).toReturnWith({});
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: {} });
//     });
//
//     {
//       type TestCase = {
//         name: string;
//         params: {
//           courseId: string;
//           lessonId: string;
//           videoId: string;
//         };
//         exception: Error;
//       };
//       it.each([
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//             videoId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "NaN",
//             videoId: "1",
//           },
//           exception: new NaNException("courseId || lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "1",
//             videoId: "NaN",
//           },
//           exception: new NaNException("videoId"),
//         },
//       ] satisfies TestCase[])(
//         "",
//         async ({ name, params, exception }: TestCase) => {
//           /**
//            * Arrange
//            *
//            */
//           (mockRequest as any).user = {
//             id: "1",
//           };
//           mockRequest.params = params;
//
//           /**
//            * Act
//            *
//            */
//           await sut.deleteVideo(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).not.toBeCalled();
//
//           expect(mockDeleteVideo).not.toBeCalled();
//
//           expect(mockNext).toBeCalledTimes(1);
//           expect((mockNext as jest.Mock).mock.calls[0][0]).toEqual(exception);
//           expect(mockNext).toBeCalledWith(
//             (mockNext as jest.Mock).mock.calls[0][0],
//           );
//           expect(mockResponse.status).not.toBeCalled();
//           expect(mockResponse.json).not.toBeCalled();
//         },
//       );
//     }
//   });
// });
