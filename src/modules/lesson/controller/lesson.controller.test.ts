// import * as ValidateJoiModule from "../../../common/functions/validateJoi";
// import { NextFunction, Request, Response } from "express";
// import dIContainer from "../../../inversifyConfig";
// import { ICourseLessonController } from "./lesson.controller";
// import { CourseLessonDITypes } from "../lesson.type";
// import {
//   CourseLessonService,
//   ICourseLessonService,
// } from "../service/lesson.service";
// import validateJoi from "../../../common/functions/validateJoi";
// import {
//   CreateCourseLessonDtoJoi,
//   UpdateCourseLessonDtoJoi,
// } from "./lesson.joi";
// import { StatusCode } from "../../../common/constants/statusCode";
// import NaNException from "../../../common/class/exceptions/NaNException";
//
// const mockCreateLesson = jest.fn();
// const mockGetLessonById = jest.fn();
// const mockUpdateLesson = jest.fn();
// const mockDeleteLesson = jest.fn();
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
// describe("CourseLessonController Test Suites", () => {
//   let sut: ICourseLessonController;
//   let mockRequest: Request;
//   let mockResponse: Response;
//   let mockNext: NextFunction;
//
//   beforeAll(() => {
//     dIContainer.unbind(CourseLessonDITypes.SERVICE);
//     dIContainer
//       .bind<ICourseLessonService>(CourseLessonDITypes.SERVICE)
//       .toConstantValue({
//         createLesson: mockCreateLesson,
//         getLessonById: mockGetLessonById,
//         updateLesson: mockUpdateLesson,
//         deleteLesson: mockDeleteLesson,
//         validateRelationBetweenResources: jest.fn(),
//       });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseLessonDITypes.SERVICE);
//     dIContainer
//       .bind<ICourseLessonService>(CourseLessonDITypes.SERVICE)
//       .to(CourseLessonService);
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
//     sut = dIContainer.get<ICourseLessonController>(
//       CourseLessonDITypes.CONTROLLER,
//     );
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("createLesson", () => {
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
//       };
//
//       const createdLesson = {};
//       mockCreateLesson.mockReturnValueOnce(createdLesson);
//
//       /**
//        * Act
//        *
//        */
//       await sut.createLesson(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).toBeCalledTimes(1);
//       expect(validateJoi).toBeCalledWith({ body: CreateCourseLessonDtoJoi });
//
//       expect(mockCreateLesson).toBeCalledTimes(1);
//       expect(mockCreateLesson).toReturnWith(createdLesson);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.RESOURCE_CREATED);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: createdLesson });
//     });
//
//     {
//       type TestCase = {
//         name: string;
//         params: {
//           courseId: string;
//         };
//         exception: Error;
//       };
//       it.each([
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//           },
//           exception: new NaNException("courseId"),
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
//           await sut.createLesson(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).toBeCalledTimes(1);
//           expect(validateJoi).toBeCalledWith({
//             body: CreateCourseLessonDtoJoi,
//           });
//
//           expect(mockCreateLesson).not.toBeCalled();
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
//   describe("getLessonById", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockValidateJoiOnce();
//
//       mockRequest.params = {
//         courseId: "1",
//         lessonId: "1",
//       };
//
//       const lesson = {};
//       mockGetLessonById.mockReturnValueOnce(lesson);
//
//       /**
//        * Act
//        *
//        */
//       await sut.getLessonById(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).not.toBeCalled();
//
//       expect(mockGetLessonById).toBeCalledTimes(1);
//       expect(mockGetLessonById).toReturnWith(lesson);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: lesson });
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
//             courseId: "1",
//             lessonId: "NaN",
//           },
//           exception: new NaNException("lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//           },
//           exception: new NaNException("courseId"),
//         },
//       ] satisfies TestCase[])(
//         "",
//         async ({ name, params, exception }: TestCase) => {
//           /**
//            * Arrange
//            *
//            */
//           mockRequest.params = params;
//
//           /**
//            * Act
//            *
//            */
//           await sut.getLessonById(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).not.toBeCalled();
//
//           expect(mockGetLessonById).not.toBeCalled();
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
//   describe("updateLesson", () => {
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
//       };
//
//       const updatedLesson = {};
//       mockUpdateLesson.mockReturnValueOnce(updatedLesson);
//
//       /**
//        * Act
//        *
//        */
//       await sut.updateLesson(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).toBeCalledTimes(1);
//       expect(validateJoi).toBeCalledWith({ body: UpdateCourseLessonDtoJoi });
//
//       expect(mockUpdateLesson).toBeCalledTimes(1);
//       expect(mockUpdateLesson).toReturnWith(updatedLesson);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: updatedLesson });
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
//             courseId: "1",
//             lessonId: "NaN",
//           },
//           exception: new NaNException("lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//           },
//           exception: new NaNException("courseId"),
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
//           await sut.updateLesson(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).toBeCalledTimes(1);
//           expect(validateJoi).toBeCalledWith({
//             body: UpdateCourseLessonDtoJoi,
//           });
//
//           expect(mockUpdateLesson).not.toBeCalled();
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
//       };
//
//       mockDeleteLesson.mockReturnValueOnce({});
//
//       /**
//        * Act
//        *
//        */
//       await sut.deleteLesson(mockRequest, mockResponse, mockNext);
//
//       /**
//        * Assert
//        *
//        */
//       expect(validateJoi).not.toBeCalled();
//
//       expect(mockDeleteLesson).toBeCalledTimes(1);
//       expect(mockDeleteLesson).toReturnWith({});
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
//         };
//         exception: Error;
//       };
//       it.each([
//         {
//           name: "",
//           params: {
//             courseId: "1",
//             lessonId: "NaN",
//           },
//           exception: new NaNException("lessonId"),
//         },
//         {
//           name: "",
//           params: {
//             courseId: "NaN",
//             lessonId: "1",
//           },
//           exception: new NaNException("courseId"),
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
//           await sut.deleteLesson(mockRequest, mockResponse, mockNext);
//
//           /**
//            * Assert
//            *
//            */
//           expect(validateJoi).not.toBeCalled();
//
//           expect(mockDeleteLesson).not.toBeCalled();
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
