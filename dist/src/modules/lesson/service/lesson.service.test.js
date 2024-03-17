"use strict";
// import dIContainer from "../../../inversifyConfig";
// import { CourseLessonDITypes } from "../lesson.type";
// import {
//   CourseLessonRepository,
//   ICourseLessonRepository,
// } from "../repository/lesson.repository";
// import { ICourseLessonService } from "./lesson.service";
// import { CourseModel } from "../../course/course.type";
// import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
//
// enum Fail {
//   SHOULD_THROW_AN_ERROR = "Should throw an error!",
//   SHOULD_NOT_THROW_AN_ERROR = "Should not throw an error!",
// }
//
// const mockCreateLesson = jest.fn();
// const mockGetLessonById = jest.fn();
// const mockUpdateLesson = jest.fn();
// const mockDeleteLesson = jest.fn();
//
// describe("CourseLessonService Test Suites", () => {
//   let sut: ICourseLessonService;
//
//   beforeAll(() => {
//     dIContainer.unbind(CourseLessonDITypes.REPOSITORY);
//     dIContainer
//       .bind<ICourseLessonRepository>(CourseLessonDITypes.REPOSITORY)
//       .toConstantValue({
//         createLesson: mockCreateLesson,
//         getLessonById: mockGetLessonById,
//         getLessonByIdOrThrow: jest.fn(),
//         updateLesson: mockUpdateLesson,
//         deleteLesson: mockDeleteLesson,
//       });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseLessonDITypes.REPOSITORY);
//     dIContainer
//       .bind<ICourseLessonRepository>(CourseLessonDITypes.REPOSITORY)
//       .to(CourseLessonRepository);
//   });
//
//   beforeEach(() => {
//     sut = dIContainer.get<ICourseLessonService>(CourseLessonDITypes.SERVICE);
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
//       const createdLesson = {};
//       mockCreateLesson.mockReturnValueOnce(createdLesson);
//
//       /**
//        * Act
//        *
//        */
//       const actual = await sut.createLesson(undefined as any, undefined as any);
//
//       /**
//        * Assert
//        *
//        */
//       expect(mockCreateLesson).toBeCalledTimes(1);
//       expect(createdLesson).toEqual(actual);
//     });
//   });
//
//   describe("getLessonById", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       const lesson = { id: 1 };
//       mockGetLessonById.mockReturnValueOnce(lesson);
//
//       /**
//        * Act
//        *
//        */
//       const actual = await sut.getLessonById(
//         undefined as any,
//         undefined as any,
//       );
//
//       /**
//        * Assert
//        *
//        */
//       expect(mockGetLessonById).toBeCalledTimes(1);
//       expect(lesson).toEqual(actual);
//     });
//
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockGetLessonById.mockReturnValueOnce(null);
//
//       try {
//         /**
//          * Act
//          *
//          */
//         await sut.getLessonById(undefined as any, undefined as any);
//
//         fail(Fail.SHOULD_THROW_AN_ERROR);
//       } catch (error) {
//         /**
//          * Assert
//          *
//          */
//         expect(mockGetLessonById).toBeCalledTimes(1);
//         expect(error).toBeInstanceOf(RecordNotFoundException);
//       }
//     });
//   });
//
//   describe("updateLesson", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockGetLessonById.mockReturnValueOnce({ id: 1 });
//       const updatedLesson = { id: 1, title: "updatedTitle" };
//       mockUpdateLesson.mockReturnValueOnce(updatedLesson);
//
//       /**
//        * Act
//        *
//        */
//       const actual = await sut.updateLesson(
//         undefined as any,
//         undefined as any,
//         undefined as any,
//       );
//
//       /**
//        * Assert
//        *
//        */
//       expect(mockGetLessonById).toBeCalledTimes(1);
//       expect(mockUpdateLesson).toBeCalledTimes(1);
//       expect(updatedLesson).toEqual(actual);
//     });
//
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockGetLessonById.mockReturnValueOnce(null);
//
//       try {
//         /**
//          * Act
//          *
//          */
//         await sut.updateLesson(
//           undefined as any,
//           undefined as any,
//           undefined as any,
//         );
//
//         fail(Fail.SHOULD_THROW_AN_ERROR);
//       } catch (error) {
//         /**
//          * Assert
//          *
//          */
//         expect(mockGetLessonById).toBeCalledTimes(1);
//         expect(mockUpdateLesson).not.toBeCalled();
//         expect(error).toBeInstanceOf(RecordNotFoundException);
//       }
//     });
//   });
//
//   describe("deleteLesson", () => {
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockGetLessonById.mockReturnValueOnce({ id: 1 });
//
//       /**
//        * Act
//        *
//        */
//       const actual = await sut.deleteLesson(undefined as any, undefined as any);
//
//       /**
//        * Assert
//        *
//        */
//       expect(mockGetLessonById).toBeCalledTimes(1);
//       expect(mockDeleteLesson).toBeCalledTimes(1);
//       expect({}).toEqual(actual);
//     });
//
//     it("", async () => {
//       /**
//        * Arrange
//        *
//        */
//       mockGetLessonById.mockReturnValueOnce(null);
//
//       try {
//         /**
//          * Act
//          *
//          */
//         await sut.deleteLesson(undefined as any, undefined as any);
//
//         fail(Fail.SHOULD_THROW_AN_ERROR);
//       } catch (error) {
//         /**
//          * Assert
//          *
//          */
//         expect(mockGetLessonById).toBeCalledTimes(1);
//         expect(mockDeleteLesson).not.toBeCalled();
//         expect(error).toBeInstanceOf(RecordNotFoundException);
//       }
//     });
//   });
// });
