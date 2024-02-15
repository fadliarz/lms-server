// import "reflect-metadata";
// import { Request, Response, NextFunction } from "express";
// import errorMiddleware from "../../middlewares/errorMiddleware";
// import { ICourseLessonController } from "./controller/lesson.controller";
// import { PrismaClient } from "@prisma/client";
// import dIContainer from "../../inversifyConfig";
// import {
//   CourseLessonDITypes,
//   CourseLessonModel,
//   CreateCourseLessonDto,
//   UpdateCourseLessonDto,
// } from "./lesson.type";
// import PrismaClientSingleton from "../../common/class/PrismaClientSingleton";
// import { CourseLessonService } from "./service/lesson.service";
// import { StatusCode } from "../../common/constants/statusCode";
// import { ErrorCode } from "../../common/constants/errorCode";
// import { IRandDB } from "../../common/class/randprisma/rand.type";
// import RandPrisma from "../../common/class/randprisma/RandPrisma";
// import { UserRoleModel } from "../course/course.type";
//
// /**
//  *
//  * This is an integration test file for:
//  * 1. Controller
//  * 2. Service
//  * 3. Repository
//  *
//  */
//
// /**
//  *
//  * @param mockRequest
//  * @param mockResponse
//  * @param next
//  *
//  * Mock next() function so it can simulates real wold scenario.
//  *
//  */
// function mockNextError(
//   mockRequest: Request,
//   mockResponse: Response,
//   mockNext: NextFunction,
// ): void {
//   (mockNext as jest.Mock).mockImplementation((error: Error) => {
//     errorMiddleware(error, mockRequest, mockResponse, mockNext);
//   });
// }
//
// describe("CourseLesson", () => {
//   let controller: ICourseLessonController;
//   let prisma: PrismaClient;
//   let randDb: IRandDB;
//   let mockRequest: Request;
//   let mockResponse: Response;
//   let mockNext: NextFunction;
//
//   beforeAll(async () => {
//     controller = dIContainer.get<ICourseLessonController>(
//       CourseLessonDITypes.CONTROLLER,
//     );
//     prisma = PrismaClientSingleton.getInstance();
//     randDb = new RandPrisma();
//   });
//
//   beforeEach(() => {
//     mockRequest = {} as Request;
//     mockResponse = {
//       status: jest.fn(() => mockResponse),
//       json: jest.fn(),
//     } as any as Response;
//     mockNext = jest.fn();
//   });
//
//   afterEach(() => {
//     jest.resetAllMocks();
//   });
//
//   describe("CreateLesson", () => {
//     type TestParams = {
//       mockRequest: Request;
//       mockResponse: Response;
//       mockNext: NextFunction;
//     };
//     type TestCase = {
//       name: string;
//       modifyDto: (dto: CreateCourseLessonDto) => Partial<CreateCourseLessonDto>;
//       test: (params: TestParams) => Promise<void>;
//     };
//
//     const testCases: TestCase[] = [
//       {
//         name: "OK: Complete Dto",
//         modifyDto: (
//           dto: CreateCourseLessonDto,
//         ): Partial<CreateCourseLessonDto> => {
//           return {
//             ...dto,
//           };
//         },
//         test: async (params: TestParams): Promise<void> => {
//           const { mockRequest, mockResponse, mockNext } = params;
//           const spyOnCreateLessonService = jest.spyOn(
//             CourseLessonService.prototype,
//             "createLesson",
//           );
//
//           await controller.createLesson(mockRequest, mockResponse, mockNext);
//
//           expect(spyOnCreateLessonService).toHaveBeenCalledTimes(1);
//           expect(spyOnCreateLessonService).toHaveBeenCalledWith(
//             Number((mockRequest as any).params.courseId),
//             mockRequest.body,
//           );
//
//           const newLesson = (await spyOnCreateLessonService.mock.results[0]
//             .value) satisfies CourseLessonModel;
//
//           expect(mockNext).not.toHaveBeenCalled();
//           expect(mockResponse.status).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledWith(
//             StatusCode.RESOURCE_CREATED,
//           );
//           expect(mockResponse.json).toHaveBeenCalledTimes(1);
//           expect(mockResponse.json).toHaveBeenCalledWith({
//             data: newLesson,
//           });
//         },
//       },
//       {
//         name: "OK: Missing description",
//         modifyDto: (
//           dto: CreateCourseLessonDto,
//         ): Partial<CreateCourseLessonDto> => {
//           return {
//             ...dto,
//             description: undefined,
//           };
//         },
//         test: async (params: TestParams): Promise<void> => {
//           const { mockRequest, mockResponse, mockNext } = params;
//           const spyOnCreateLessonService = jest.spyOn(
//             CourseLessonService.prototype,
//             "createLesson",
//           );
//
//           await controller.createLesson(mockRequest, mockResponse, mockNext);
//
//           expect(spyOnCreateLessonService).toHaveBeenCalledTimes(1);
//           expect(spyOnCreateLessonService).toHaveBeenCalledWith(
//             Number((mockRequest as any).params.courseId),
//             mockRequest.body,
//           );
//
//           const newLesson = (await spyOnCreateLessonService.mock.results[0]
//             .value) satisfies CourseLessonModel;
//
//           expect(mockNext).not.toHaveBeenCalled();
//           expect(mockResponse.status).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledWith(
//             StatusCode.RESOURCE_CREATED,
//           );
//           expect(mockResponse.json).toHaveBeenCalledTimes(1);
//           expect(mockResponse.json).toHaveBeenCalledWith({
//             data: newLesson,
//           });
//         },
//       },
//       {
//         name: "BadRequest: Missing title",
//         modifyDto: (
//           dto: CreateCourseLessonDto,
//         ): Partial<CreateCourseLessonDto> => {
//           return {
//             ...dto,
//             title: undefined,
//           };
//         },
//         test: async (params: TestParams): Promise<void> => {
//           const { mockRequest, mockResponse, mockNext } = params;
//           mockNextError(mockRequest, mockResponse, mockNext);
//           const spyOnCreateLessonService = jest.spyOn(
//             CourseLessonService.prototype,
//             "createLesson",
//           );
//
//           await controller.createLesson(mockRequest, mockResponse, mockNext);
//
//           expect(spyOnCreateLessonService).toHaveBeenCalledTimes(0);
//
//           expect(mockNext).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledWith(
//             StatusCode.BAD_REQUEST,
//           );
//           expect(mockResponse.json).toHaveBeenCalledTimes(1);
//           expect(mockResponse.json).toHaveBeenCalledWith({
//             error: {
//               errorCode: ErrorCode.INVALID_BODY,
//               message: expect.any(String),
//             },
//           });
//         },
//       },
//     ];
//
//     testCases.forEach(async (tc) => {
//       return it(tc.name, async () => {
//         const {
//           course: { id: courseId },
//         } = await randDb.course.generateOne(UserRoleModel.INSTRUCTOR);
//         (mockRequest as any).params = {
//           courseId: courseId.toString(),
//         };
//         const dto = randDb.generateCreateLessonDto();
//         mockRequest.body = tc.modifyDto(dto);
//
//         await tc.test({
//           mockRequest,
//           mockResponse,
//           mockNext,
//         });
//       });
//     });
//   });
//
//   describe("UpdateLesson", () => {
//     type TestParams = {
//       mockRequest: Request;
//       mockResponse: Response;
//       mockNext: NextFunction;
//     };
//     type TestCase = {
//       name: string;
//       modifyDto: (dto: UpdateCourseLessonDto) => Partial<UpdateCourseLessonDto>;
//       test: (params: TestParams) => Promise<void>;
//     };
//
//     const testCases: TestCase[] = [
//       {
//         name: "OK: Complete Dto",
//         modifyDto: (
//           dto: UpdateCourseLessonDto,
//         ): Partial<UpdateCourseLessonDto> => {
//           return {
//             ...dto,
//           };
//         },
//         test: async (params: TestParams): Promise<void> => {
//           const { mockRequest, mockResponse, mockNext } = params;
//           const spyOnUpdateLessonService = jest.spyOn(
//             CourseLessonService.prototype,
//             "updateLesson",
//           );
//
//           await controller.updateLesson(mockRequest, mockResponse, mockNext);
//
//           expect(spyOnUpdateLessonService).toHaveBeenCalledTimes(1);
//           expect(spyOnUpdateLessonService).toHaveBeenCalledWith(
//             Number(mockRequest.params.lessonId),
//             mockRequest.body,
//           );
//
//           const updatedLesson = (await spyOnUpdateLessonService.mock.results[0]
//             .value) satisfies CourseLessonModel;
//
//           expect(mockNext).not.toHaveBeenCalled();
//           expect(mockResponse.status).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
//           expect(mockResponse.json).toHaveBeenCalledTimes(1);
//           expect(mockResponse.json).toHaveBeenCalledWith({
//             data: updatedLesson,
//           });
//         },
//       },
//       {
//         name: "OK: Missing description",
//         modifyDto: (
//           dto: UpdateCourseLessonDto,
//         ): Partial<UpdateCourseLessonDto> => {
//           return {
//             ...dto,
//             description: undefined,
//           };
//         },
//         test: async (params: TestParams): Promise<void> => {
//           const { mockRequest, mockResponse, mockNext } = params;
//           const spyOnUpdateLessonService = jest.spyOn(
//             CourseLessonService.prototype,
//             "updateLesson",
//           );
//
//           await controller.updateLesson(mockRequest, mockResponse, mockNext);
//
//           expect(spyOnUpdateLessonService).toHaveBeenCalledTimes(1);
//           expect(spyOnUpdateLessonService).toHaveBeenCalledWith(
//             Number(mockRequest.params.lessonId),
//             mockRequest.body,
//           );
//
//           const updatedLesson = (await spyOnUpdateLessonService.mock.results[0]
//             .value) satisfies CourseLessonModel;
//
//           expect(mockNext).not.toHaveBeenCalled();
//           expect(mockResponse.status).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
//           expect(mockResponse.json).toHaveBeenCalledTimes(1);
//           expect(mockResponse.json).toHaveBeenCalledWith({
//             data: updatedLesson,
//           });
//         },
//       },
//       {
//         name: "OK: Missing title",
//         modifyDto: (
//           dto: UpdateCourseLessonDto,
//         ): Partial<UpdateCourseLessonDto> => {
//           return {
//             ...dto,
//             title: undefined,
//           };
//         },
//         test: async (params: TestParams): Promise<void> => {
//           const { mockRequest, mockResponse, mockNext } = params;
//           const spyOnUpdateLessonService = jest.spyOn(
//             CourseLessonService.prototype,
//             "updateLesson",
//           );
//
//           await controller.updateLesson(mockRequest, mockResponse, mockNext);
//
//           expect(spyOnUpdateLessonService).toHaveBeenCalledTimes(1);
//           expect(spyOnUpdateLessonService).toHaveBeenCalledWith(
//             Number(mockRequest.params.lessonId),
//             mockRequest.body,
//           );
//
//           const updatedLesson = (await spyOnUpdateLessonService.mock.results[0]
//             .value) satisfies CourseLessonModel;
//
//           expect(mockNext).not.toHaveBeenCalled();
//           expect(mockResponse.status).toHaveBeenCalledTimes(1);
//           expect(mockResponse.status).toHaveBeenCalledWith(StatusCode.SUCCESS);
//           expect(mockResponse.json).toHaveBeenCalledTimes(1);
//           expect(mockResponse.json).toHaveBeenCalledWith({
//             data: updatedLesson,
//           });
//         },
//       },
//     ];
//
//     testCases.forEach(async (tc) => {
//       return it(tc.name, async () => {
//         const {
//           lesson: { id: lessonId },
//         } = await randDb.generateLesson();
//         (mockRequest as any).params = {
//           lessonId: lessonId.toString(),
//         };
//         const dto = randDb.generateCreateLessonDto();
//         mockRequest.body = tc.modifyDto(dto);
//
//         await tc.test({
//           mockRequest,
//           mockResponse,
//           mockNext,
//         });
//       });
//     });
//   });
// });
