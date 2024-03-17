"use strict";
// import "reflect-metadata";
// import dIContainer from "../../../inversifyConfig";
// import {
//   CourseLessonDITypes,
//   CourseLessonResourceId,
//   CreateCourseLessonDto,
//   ICourseLessonAuthorization,
//   UpdateCourseLessonDto,
// } from "../lesson.type";
// import { ICourseLessonRepository } from "./lesson.repository";
// import CourseLessonAuthorization from "../authorization/lesson.authorization";
// import { GetCourseByIdQuery, UserRoleModel } from "../../course/course.type";
// import {
//   IRandDTO,
//   RandDTODITypes,
// } from "../../../common/class/rand_dto/rand_dto.type";
// import {
//   IRepository,
//   RepositoryDITypes,
// } from "../../../common/class/repository/repository.type";
// import ClientException from "../../../common/class/exceptions/ClientException";
// import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
// import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
//
// enum Fail {
//   SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
//   SHOULD_THROW_AN_ERROR = "Should throw an error",
// }
//
// /**
//  * Authorization mock function
//  *
//  */
// const mockAuthorizeCreateLesson = jest.fn();
// const mockAuthorizeUpdateLesson = jest.fn();
// const mockAuthorizeDeleteLesson = jest.fn();
//
// /**
//  * Resource Id
//  *
//  */
//
// describe("CourseLessonRepository Test Suite", () => {
//   let sut: ICourseLessonRepository;
//   let repository: IRepository;
//   let randDTO: IRandDTO;
//
//   beforeAll(() => {
//     dIContainer.unbind(CourseLessonDITypes.AUTHORIZATION);
//     dIContainer
//       .bind<ICourseLessonAuthorization>(CourseLessonDITypes.AUTHORIZATION)
//       .toConstantValue({
//         authorizeCreateLesson: mockAuthorizeCreateLesson,
//         authorizeUpdateLesson: mockAuthorizeUpdateLesson,
//         authorizeDeleteLesson: mockAuthorizeDeleteLesson,
//       });
//     repository = dIContainer.get<IRepository>(RepositoryDITypes.FACADE);
//     randDTO = dIContainer.get<IRandDTO>(RandDTODITypes.FACADE);
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseLessonDITypes.AUTHORIZATION);
//     dIContainer
//       .bind<ICourseLessonAuthorization>(CourseLessonDITypes.AUTHORIZATION)
//       .to(CourseLessonAuthorization);
//   });
//
//   beforeEach(() => {
//     sut = dIContainer.get<ICourseLessonRepository>(
//       CourseLessonDITypes.REPOSITORY,
//     );
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("CourseLessonRepository Test Suite", () => {
//     it("createLesson", async () => {
//       const author = await repository.user.createUser(
//         randDTO.user.generateCreateUserDTO(),
//         "",
//         [],
//       );
//       await repository.user.unauthorizedUpdateUser(author.id, {
//         role: UserRoleModel.INSTRUCTOR,
//       });
//       const category = await repository.courseCategory.createCategory(
//         { userId: author.id },
//         { title: "someTitle" },
//       );
//       const course = await repository.course.createCourse(
//         {
//           userId: author.id,
//         },
//         randDTO.course.generateCreateCourseDTO(category.id),
//       );
//       const resourceId: CourseLessonResourceId = {
//         userId: author.id,
//         courseId: course.id,
//       };
//       const dto: CreateCourseLessonDto = {
//         title: "someTitle",
//       };
//
//       expect(course.totalLessons).toEqual(0);
//
//       const actual = await sut.createLesson(resourceId, dto);
//       expect(actual.id).toBeDefined();
//
//       const expected = await repository.courseLesson.getLessonByIdOrThrow(
//         actual.id,
//         resourceId,
//       );
//       expect(expected).toBeDefined();
//       expect(expected).toEqual(actual);
//
//       const updatedCourse = await repository.course.getCourseByIdOrThrow(
//         course.id,
//         resourceId,
//         {} as GetCourseByIdQuery,
//       );
//       expect(updatedCourse).toBeDefined();
//       expect({
//         ...updatedCourse,
//         totalLessons: undefined,
//         updatedAt: undefined,
//       }).toEqual({
//         ...course,
//         totalLessons: undefined,
//         updatedAt: undefined,
//       });
//       expect(updatedCourse.updatedAt).not.toEqual(course.updatedAt);
//       expect(updatedCourse.totalLessons).not.toEqual(course.totalLessons);
//       expect(updatedCourse.totalLessons).toEqual(1);
//     });
//
//     it("getLessonById", async () => {
//       const author = await repository.user.createUser(
//         randDTO.user.generateCreateUserDTO(),
//         "",
//         [],
//       );
//       await repository.user.unauthorizedUpdateUser(author.id, {
//         role: UserRoleModel.INSTRUCTOR,
//       });
//       const category = await repository.courseCategory.createCategory(
//         { userId: author.id },
//         { title: "someTitle" },
//       );
//       const course = await repository.course.createCourse(
//         { userId: author.id },
//         randDTO.course.generateCreateCourseDTO(category.id),
//       );
//       const resourceId: CourseLessonResourceId = {
//         userId: author.id,
//         courseId: course.id,
//       };
//       const dto: CreateCourseLessonDto = {
//         title: "someTitle",
//       };
//       const lesson = await repository.courseLesson.createLesson(
//         resourceId,
//         dto,
//       );
//
//       const actual = await sut.getLessonById(lesson.id, {
//         courseId: course.id,
//       });
//       expect(actual).not.toBeNull();
//       expect(actual).toBeDefined();
//
//       const expected = lesson;
//       expect(expected).toBeDefined();
//       expect(expected).toEqual(actual);
//     });
//
//     type GetLessonByIdOrThrowTestArgs = {
//       exception?: Error;
//     };
//     it.each([
//       { exception: new ClientException() },
//       {},
//     ] as GetLessonByIdOrThrowTestArgs[])(
//       "getLessonByIdOrThrow",
//       async ({ exception }: GetLessonByIdOrThrowTestArgs) => {
//         const author = await repository.user.createUser(
//           randDTO.user.generateCreateUserDTO(),
//           "",
//           [],
//         );
//         await repository.user.unauthorizedUpdateUser(author.id, {
//           role: UserRoleModel.INSTRUCTOR,
//         });
//         const category = await repository.courseCategory.createCategory(
//           { userId: author.id },
//           { title: "someTitle" },
//         );
//         const course = await repository.course.createCourse(
//           {
//             userId: author.id,
//           },
//           randDTO.course.generateCreateCourseDTO(category.id),
//         );
//         const resourceId: CourseLessonResourceId = {
//           userId: author.id,
//           courseId: course.id,
//         };
//         const dto: CreateCourseLessonDto = {
//           title: "someTitle",
//         };
//         const lesson = await repository.courseLesson.createLesson(
//           resourceId,
//           dto,
//         );
//
//         await repository.courseLesson.deleteLesson(lesson.id, resourceId);
//
//         const deletedLesson = await repository.courseLesson.getLessonById(
//           lesson.id,
//           {
//             courseId: course.id,
//           },
//         );
//         expect(deletedLesson).toBeNull();
//
//         try {
//           const actual = await sut.getLessonByIdOrThrow(
//             lesson.id,
//             {
//               courseId: course.id,
//             },
//             exception,
//           );
//
//           fail(Fail.SHOULD_THROW_AN_ERROR);
//         } catch (error) {
//           if (exception) {
//             expect(error).toEqual(exception);
//           }
//
//           if (!exception) {
//             expect(error).toEqual(expect.any(RecordNotFoundException));
//           }
//         }
//       },
//     );
//
//     it("updateLesson", async () => {
//       const author = await repository.user.createUser(
//         randDTO.user.generateCreateUserDTO(),
//         "",
//         [],
//       );
//       await repository.user.unauthorizedUpdateUser(author.id, {
//         role: UserRoleModel.INSTRUCTOR,
//       });
//       const category = await repository.courseCategory.createCategory(
//         { userId: author.id },
//         { title: "someTitle" },
//       );
//       const course = await repository.course.createCourse(
//         {
//           userId: author.id,
//         },
//         randDTO.course.generateCreateCourseDTO(category.id),
//       );
//       const resourceId: CourseLessonResourceId = {
//         userId: author.id,
//         courseId: course.id,
//       };
//       const dto: UpdateCourseLessonDto = {
//         title: "someNewTitle",
//         description: "someNewDescription",
//       };
//
//       const lesson = await repository.courseLesson.createLesson(resourceId, {
//         title: "someTitle",
//       });
//       const expected = lesson;
//       expect(expected).toBeDefined();
//
//       const actual = await sut.updateLesson(lesson.id, resourceId, dto);
//       expect(actual).toBeDefined();
//
//       expect(expected.updatedAt).not.toEqual(actual.updatedAt);
//       expect({
//         ...expected,
//         updatedAt: undefined,
//       }).not.toEqual({
//         ...actual,
//         updatedAt: undefined,
//       });
//       expect({
//         ...expected,
//         ...dto,
//         updatedAt: undefined,
//       }).toEqual({
//         ...actual,
//         ...dto,
//         updatedAt: undefined,
//       });
//     });
//
//     it("deleteLesson", async () => {
//       const author = await repository.user.createUser(
//         randDTO.user.generateCreateUserDTO(),
//         "",
//         [],
//       );
//       await repository.user.unauthorizedUpdateUser(author.id, {
//         role: UserRoleModel.OWNER,
//       });
//       const user = await repository.user.getUserByIdOrThrow(author.id);
//       expect(isEqualOrIncludeRole(user.role, UserRoleModel.OWNER)).toBe(true);
//
//       const category = await repository.courseCategory.createCategory(
//         { userId: author.id },
//         { title: "someTitle" },
//       );
//       expect(category).toBeDefined();
//
//       const { id: courseId } = await repository.course.createCourse(
//         {
//           userId: author.id,
//         },
//         randDTO.course.generateCreateCourseDTO(category.id),
//       );
//       const resourceId: CourseLessonResourceId = {
//         userId: author.id,
//         courseId: courseId,
//       };
//
//       const { id: lessonId } = await repository.courseLesson.createLesson(
//         resourceId,
//         {
//           title: "someTitle",
//         },
//       );
//       const videoDuration = 10;
//       const videoResourceId = {
//         userId: user.id,
//         courseId,
//         lessonId,
//       };
//       const { id: videoId } = await repository.courseLessonVideo.createVideo(
//         videoResourceId,
//         {
//           name: "someName",
//           description: "someDescription",
//           youtubeLink: "someYoutubeLink",
//           totalDurations: videoDuration,
//         },
//       );
//
//       const course = await repository.course.getCourseByIdOrThrow(
//         courseId,
//         resourceId,
//         {} as GetCourseByIdQuery,
//       );
//       expect(course).toBeDefined();
//       expect(course.totalLessons).toBe(1);
//       expect(course.totalVideos).toBe(1);
//       expect(course.totalDurations).toBe(videoDuration);
//
//       const lesson = await repository.courseLesson.getLessonByIdOrThrow(
//         lessonId,
//         {
//           courseId: course.id,
//         },
//       );
//       expect(lesson).toBeDefined();
//       expect(lesson.totalVideos).toBe(1);
//       expect(lesson.totalDurations).toBe(videoDuration);
//
//       const video = await repository.courseLessonVideo.getVideoByIdOrThrow(
//         videoId,
//         videoResourceId,
//       );
//       expect(video).toBeDefined();
//       expect(video);
//
//       const expected = lesson;
//       const actual = await sut.deleteLesson(lessonId, resourceId);
//       expect(actual).not.toEqual(expected);
//       expect(actual).toEqual({});
//
//       const courseAfterDeletion = await repository.course.getCourseByIdOrThrow(
//         courseId,
//         resourceId,
//         {} as GetCourseByIdQuery,
//       );
//       expect(courseAfterDeletion).toBeDefined();
//       expect(courseAfterDeletion.totalLessons).toBe(0);
//       expect(courseAfterDeletion.totalVideos).toBe(0);
//       expect(courseAfterDeletion.totalDurations).toBe(0);
//       expect({
//         ...course,
//         totalLessons: undefined,
//         totalVideos: undefined,
//         totalDurations: undefined,
//         updatedAt: undefined,
//       }).toEqual({
//         ...courseAfterDeletion,
//         totalLessons: undefined,
//         totalVideos: undefined,
//         totalDurations: undefined,
//         updatedAt: undefined,
//       });
//
//       const lessonAfterDeletion = await repository.courseLesson.getLessonById(
//         lessonId,
//         {
//           courseId: course.id,
//         },
//       );
//       expect(lessonAfterDeletion).toBeNull();
//
//       const videoAfterDeletion =
//         await repository.courseLessonVideo.getVideoById(videoId, {
//           userId: author.id,
//           courseId,
//           lessonId,
//         });
//       expect(videoAfterDeletion).toBeNull();
//     });
//   });
// });
