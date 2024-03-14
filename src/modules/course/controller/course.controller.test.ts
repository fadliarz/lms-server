// import { ICourseController } from "./course.controller";
// import dIContainer from "../../../inversifyConfig";
// import { CourseDITypes } from "../course.type";
// import { CourseService, ICourseService } from "../service/course.service";
// import { Request, Response, NextFunction } from "express";
// import { StatusCode } from "../../../common/constants/statusCode";
// import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
// import * as ValidateJoiModule from "../../../common/functions/validateJoi";
// import NaNException from "../../../common/class/exceptions/NaNException";
//
// const mockCreateCourse = jest.fn();
// const mockGetCourseById = jest.fn();
// const mockUpdateBasicCourse = jest.fn();
// const mockDeleteCourse = jest.fn();
// const mockCreateLike = jest.fn();
// const mockDeleteLike = jest.fn();
//
// function constructJoiErrorMessageOnMissingRequiredField(field: string): string {
//   return `"${field}" is required`;
// }
//
// function mockValidateJoiOnce(): void {
//   jest.spyOn(ValidateJoiModule, "default").mockImplementationOnce(() => {
//     return jest.fn();
//   });
// }
//
// describe("CourseController Test Suites", () => {
//   let sut: ICourseController;
//   let mockRequest: Request;
//   let mockResponse: Response;
//   let mockNext: NextFunction;
//
//   beforeAll(() => {
//     dIContainer.unbind(CourseDITypes.SERVICE);
//     dIContainer.bind<ICourseService>(CourseDITypes.SERVICE).toConstantValue({
//       createCourse: mockCreateCourse,
//       getCourseById: mockGetCourseById,
//       getCourses: jest.fn(),
//       getEnrolledCourses: jest.fn(),
//       updateBasicCourse: mockUpdateBasicCourse,
//       deleteCourse: mockDeleteCourse,
//       createLike: mockCreateLike,
//       deleteLike: mockDeleteLike,
//       validateRelationBetweenResources: jest.fn(),
//     });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseDITypes.SERVICE);
//     dIContainer.bind<ICourseService>(CourseDITypes.SERVICE).to(CourseService);
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
//     sut = dIContainer.get<ICourseController>(CourseDITypes.CONTROLLER);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("createCourse", () => {
//     it("missing userId: throw AuthenticationException", async () => {
//       mockValidateJoiOnce();
//
//       await sut.createCourse(mockRequest, mockResponse, mockNext);
//
//       expect(mockCreateCourse).not.toBeCalledWith();
//
//       expect(mockNext).toBeCalledTimes(1);
//       expect(mockNext).toBeCalledWith(expect.any(AuthenticationException));
//       expect(mockResponse.status).not.toBeCalled();
//       expect(mockResponse.json).not.toBeCalled();
//     });
//
//     it("userId is included: should create course", async () => {
//       mockValidateJoiOnce();
//       (mockRequest as any).user = {
//         id: 1,
//       };
//       const createdCourse = {};
//       mockCreateCourse.mockReturnValueOnce(createdCourse);
//
//       await sut.createCourse(mockRequest, mockResponse, mockNext);
//
//       expect(mockCreateCourse).toBeCalledTimes(1);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.RESOURCE_CREATED);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: createdCourse });
//     });
//   });
//
//   describe("getCourseById", () => {
//     it("", async () => {
//       mockValidateJoiOnce();
//
//       mockRequest.params = {
//         courseId: "1",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//       const course = {};
//       mockGetCourseById.mockReturnValueOnce(course);
//
//       await sut.getCourseById(mockRequest, mockResponse, mockNext);
//
//       expect(mockGetCourseById).toBeCalledTimes(1);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: course });
//     });
//
//     it("", async () => {
//       mockValidateJoiOnce();
//
//       mockRequest.params = {
//         courseId: "NaN",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//
//       await sut.getCourseById(mockRequest, mockResponse, mockNext);
//
//       expect(mockGetCourseById).not.toBeCalled();
//
//       expect(mockNext).toBeCalledTimes(1);
//       expect(mockNext).toBeCalledWith(expect.any(NaNException));
//       expect(mockResponse.status).not.toBeCalled();
//       expect(mockResponse.json).not.toBeCalled();
//     });
//   });
//
//   describe("updateBasicCourse", () => {
//     it("", async () => {
//       mockValidateJoiOnce();
//
//       mockRequest.params = {
//         courseId: "1",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//       const updatedCourse = {};
//       mockUpdateBasicCourse.mockReturnValueOnce(updatedCourse);
//
//       await sut.updateBasicCourse(mockRequest, mockResponse, mockNext);
//
//       expect(mockUpdateBasicCourse).toBeCalledTimes(1);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: updatedCourse });
//     });
//   });
//
//   describe("deleteCourse", () => {
//     it("", async () => {
//       mockRequest.params = {
//         courseId: "1",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//
//       await sut.deleteCourse(mockRequest, mockResponse, mockNext);
//
//       expect(mockDeleteCourse).toBeCalledTimes(1);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: {} });
//     });
//   });
//
//   describe("createLike", () => {
//     it("", async () => {
//       mockRequest.params = {
//         courseId: "1",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//       const createdLike = {};
//       mockCreateLike.mockReturnValueOnce(createdLike);
//
//       await sut.createLike(mockRequest, mockResponse, mockNext);
//
//       expect(mockCreateLike).toBeCalledTimes(1);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.RESOURCE_CREATED);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: createdLike });
//     });
//
//     it("", async () => {
//       mockRequest.params = {
//         courseId: "NaN",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//
//       await sut.createLike(mockRequest, mockResponse, mockNext);
//
//       expect(mockCreateLike).not.toBeCalledWith();
//
//       expect(mockNext).toBeCalledTimes(1);
//       expect(mockNext).toBeCalledWith(expect.any(NaNException));
//       expect(mockResponse.status).not.toBeCalled();
//       expect(mockResponse.json).not.toBeCalled();
//     });
//   });
//
//   describe("deleteLike", () => {
//     it("", async () => {
//       mockRequest.params = {
//         courseId: "1",
//         likeId: "1",
//       };
//       (mockRequest as any).user = {
//         id: 1,
//       };
//
//       await sut.deleteLike(mockRequest, mockResponse, mockNext);
//
//       expect(mockDeleteLike).toBeCalledTimes(1);
//
//       expect(mockNext).not.toBeCalledWith();
//       expect(mockResponse.status).toBeCalledTimes(1);
//       expect(mockResponse.status).toBeCalledWith(StatusCode.SUCCESS);
//       expect(mockResponse.json).toBeCalledTimes(1);
//       expect(mockResponse.json).toBeCalledWith({ data: {} });
//     });
//   });
//
//   it("", async () => {
//     mockRequest.params = {
//       courseId: "1",
//       likeId: "NaN",
//     };
//     (mockRequest as any).user = {
//       id: 1,
//     };
//
//     await sut.deleteLike(mockRequest, mockResponse, mockNext);
//
//     expect(mockDeleteLike).not.toBeCalledWith();
//
//     expect(mockNext).toBeCalledTimes(1);
//     expect(mockNext).toBeCalledWith(expect.any(NaNException));
//     expect(mockResponse.status).not.toBeCalled();
//     expect(mockResponse.json).not.toBeCalled();
//   });
// });
