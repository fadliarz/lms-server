"use strict";
// import "reflect-metadata";
// import dIContainer from "../../../inversifyConfig";
// import RandPrisma from "../../../common/class/randprisma/RandPrisma";
// import { ITable } from "../../../common/class/table/table.type";
// import PrismaTable, {
//   PrismaTableDITypes,
// } from "../../../common/class/table/PrismaTable";
// import { ICourseEnrollmentRepository } from "./enrollment.repository";
// import {
//   CourseEnrollmentDITypes,
//   CourseEnrollmentResourceId,
//   CreateCourseEnrollmentDto,
//   UpdateCourseEnrollmentRoleDto,
// } from "../enrollment.type";
// import { ICourseEnrollmentAuthorization } from "../authorization/enrollment.authorization";
// import {
//   CourseEnrollmentRoleModel,
//   UserRoleModel,
// } from "../../course/course.type";
// import { CourseEnrollment, CourseEnrollmentRole } from "@prisma/client";
// import ClientException from "../../../common/class/exceptions/ClientException";
// import {
//   IRandDB,
//   PrismaRandDBDITypes,
// } from "../../../common/class/randprisma/rand.type";
// import InternalServerException from "../../../common/class/exceptions/InternalServerException";
// import { exec } from "child_process";
// import isEqualOrIncludeCourseEnrollmentRole from "../../../common/functions/isEqualOrIncludeCourseEnrollmentRole";
// import { UserRole } from "../../user/user.type";
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
// const mockAuthorizeCreateEnrollment = jest.fn();
// const mockAuthorizeUpdateEnrollmentRole = jest.fn();
// const mockAuthorizeDeleteEnrollment = jest.fn();
//
// describe("CourseLessonVideoRepository Test Suite", () => {
//   let sut: ICourseEnrollmentRepository;
//   let rand: IRandDB;
//   let table: ITable;
//
//   beforeAll(() => {
//     rand = dIContainer.get<IRandDB>(PrismaRandDBDITypes.FACADE);
//     table = dIContainer.get<PrismaTable>(PrismaTableDITypes.TABLE);
//     dIContainer.unbind(CourseEnrollmentDITypes.AUTHORIZATION);
//     dIContainer
//       .bind<ICourseEnrollmentAuthorization>(
//         CourseEnrollmentDITypes.AUTHORIZATION,
//       )
//       .toConstantValue({
//         authorizeCreateEnrollment: mockAuthorizeCreateEnrollment,
//         authorizeUpdateEnrollmentRole: mockAuthorizeUpdateEnrollmentRole,
//         authorizeDeleteEnrollment: mockAuthorizeDeleteEnrollment,
//       });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(CourseEnrollmentDITypes.AUTHORIZATION);
//     dIContainer.bind<ICourseEnrollmentAuthorization>(
//       CourseEnrollmentDITypes.AUTHORIZATION,
//     );
//   });
//
//   beforeEach(() => {
//     sut = dIContainer.get<ICourseEnrollmentRepository>(
//       CourseEnrollmentDITypes.REPOSITORY,
//     );
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("CourseEnrollment Test Suite", () => {
//     describe.only("createEnrollment", () => {
//       /**
//        * happy path
//        *
//        */
//       type TestArgs = {
//         userRole: UserRoleModel;
//         enrollmentRole: CourseEnrollmentRoleModel;
//       };
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRole.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRole.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRole.INSTRUCTOR,
//         },
//         {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRole.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRole.INSTRUCTOR,
//         },
//       ] satisfies TestArgs[])(
//         "",
//         async ({ userRole, enrollmentRole }: TestArgs) => {
//           const { author, course } = await rand.course.generateOne(
//             UserRoleModel.INSTRUCTOR,
//           );
//           const userToBeEnrolled = await rand.user.generateOne(
//             UserRoleModel.STUDENT,
//           );
//           const resourceId: CourseEnrollmentResourceId = {
//             userId: author.id,
//             courseId: course.id,
//           };
//           const dto: CreateCourseEnrollmentDto = {
//             userId: userToBeEnrolled.id,
//             role: CourseEnrollmentRoleModel.STUDENT,
//           };
//
//           let createdEnrollment: CourseEnrollment | null;
//           createdEnrollment =
//             await table.courseEnrollment.findUniqueByUserIdAndCourseId(
//               userToBeEnrolled.id,
//               course.id,
//             );
//           expect(createdEnrollment).toBeNull();
//
//           const actual = await sut.createEnrollment(resourceId, dto);
//
//           const expected =
//             await table.courseEnrollment.findUniqueByUserIdAndCourseIdOrThrow(
//               dto.userId,
//               course.id,
//             );
//           expect(expected).toBeDefined();
//
//           expect(expected).toEqual(actual);
//         },
//       );
//
//       /**
//        * sad path
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRole.INSTRUCTOR,
//         },
//       ] satisfies TestArgs[])(
//         "",
//         async ({ userRole, enrollmentRole }: TestArgs) => {
//           const { author, course } = await rand.course.generateOne(
//             UserRoleModel.INSTRUCTOR,
//           );
//           const userToBeEnrolled = await rand.user.generateOne(
//             UserRoleModel.STUDENT,
//           );
//           const resourceId: CourseEnrollmentResourceId = {
//             userId: author.id,
//             courseId: course.id,
//           };
//           const dto: CreateCourseEnrollmentDto = {
//             userId: userToBeEnrolled.id,
//             role: CourseEnrollmentRoleModel.INSTRUCTOR,
//           };
//
//           let createdEnrollment: CourseEnrollment | null;
//           createdEnrollment =
//             await table.courseEnrollment.findUniqueByUserIdAndCourseId(
//               userToBeEnrolled.id,
//               course.id,
//             );
//           expect(createdEnrollment).toBeNull();
//
//           expect(sut.createEnrollment(resourceId, dto)).rejects.toThrow(
//             ClientException,
//           );
//
//           const expected =
//             await table.courseEnrollment.findUniqueByUserIdAndCourseId(
//               dto.userId,
//               course.id,
//             );
//           expect(expected).toBeNull();
//         },
//       );
//
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//         },
//         {
//           userRole: UserRoleModel.OWNER,
//         },
//       ] satisfies Omit<TestArgs, "enrollmentRole">[])(
//         `[userRole: $userRole; <Author>]: shouldn't create an enrollment`,
//         async ({ userRole }: Omit<TestArgs, "enrollmentRole">) => {
//           const { author, course } = await rand.course.generateOne(
//             UserRoleModel.INSTRUCTOR,
//           );
//           const resourceId: CourseEnrollmentResourceId = {
//             userId: author.id,
//             courseId: course.id,
//           };
//           const dto: CreateCourseEnrollmentDto = {
//             userId: author.id,
//             role: CourseEnrollmentRoleModel.INSTRUCTOR,
//           };
//
//           let createdEnrollment: CourseEnrollment | null;
//           createdEnrollment =
//             await table.courseEnrollment.findUniqueByUserIdAndCourseId(
//               author.id,
//               course.id,
//             );
//           expect(createdEnrollment).toBeNull();
//
//           expect(sut.createEnrollment(resourceId, dto)).rejects.toThrow(
//             ClientException,
//           );
//
//           const expected =
//             await table.courseEnrollment.findUniqueByUserIdAndCourseId(
//               dto.userId,
//               course.id,
//             );
//           expect(expected).toBeNull();
//         },
//       );
//
//       /**
//        * Edge path
//        *
//        */
//     });
//
//     describe.only("updateEnrollment", () => {
//       type TestArgs = {
//         targetUserRole: UserRoleModel;
//         enrollmentRole: CourseEnrollmentRoleModel;
//         newEnrollmentRole: CourseEnrollmentRoleModel;
//         exception?: Error;
//       };
//       it.each([
//         {
//           targetUserRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           newEnrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           targetUserRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           newEnrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           exception: new ClientException(),
//         },
//         {
//           targetUserRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           newEnrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           exception: new InternalServerException(),
//         },
//         {
//           targetUserRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           newEnrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           exception: new InternalServerException(),
//         },
//         {
//           targetUserRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           newEnrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           targetUserRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           newEnrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         {
//           targetUserRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           newEnrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         {
//           targetUserRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           newEnrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           targetUserRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           newEnrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           targetUserRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           newEnrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         {
//           targetUserRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           newEnrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         {
//           targetUserRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           newEnrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//       ] satisfies TestArgs[])(
//         "",
//         async ({
//           targetUserRole,
//           enrollmentRole,
//           newEnrollmentRole,
//           exception,
//         }: TestArgs) => {
//           const { author, course, enrollment, category } =
//             await rand.courseEnrollment.generateOne({
//               authorUserRole: UserRoleModel.OWNER,
//               userRole: targetUserRole,
//               enrollmentRole: enrollmentRole,
//             });
//           const resourceId: CourseEnrollmentResourceId = {
//             userId: author.id,
//             courseId: course.id,
//           };
//           const dto: UpdateCourseEnrollmentRoleDto = {
//             role: newEnrollmentRole,
//           };
//
//           let totalStudents = 0;
//           let totalInstructors = 0;
//           if (
//             isEqualOrIncludeCourseEnrollmentRole(
//               enrollment.role,
//               CourseEnrollmentRoleModel.STUDENT,
//             )
//           ) {
//             totalStudents = 1;
//           }
//           if (
//             isEqualOrIncludeCourseEnrollmentRole(
//               enrollment.role,
//               CourseEnrollmentRoleModel.INSTRUCTOR,
//             )
//           ) {
//             totalInstructors = 1;
//           }
//           expect(course.totalStudents).toEqual(totalStudents);
//           expect(course.totalInstructors).toEqual(totalInstructors);
//
//           try {
//             const actual = await sut.updateEnrollmentRole(
//               enrollment.id,
//               resourceId,
//               dto,
//             );
//
//             if (exception) {
//               fail(Fail.SHOULD_THROW_AN_ERROR);
//             }
//
//             const updatedEnrollment =
//               await table.courseEnrollment.findUniqueOrThrow(enrollment.id);
//             expect(updatedEnrollment.role).toEqual(dto.role);
//             expect(updatedEnrollment).toEqual(actual);
//
//             if (
//               !isEqualOrIncludeCourseEnrollmentRole(enrollment.role, dto.role)
//             ) {
//               if (
//                 isEqualOrIncludeCourseEnrollmentRole(
//                   dto.role,
//                   CourseEnrollmentRoleModel.STUDENT,
//                 )
//               ) {
//                 totalStudents += 1;
//                 totalInstructors += -1;
//               }
//
//               if (
//                 isEqualOrIncludeCourseEnrollmentRole(
//                   dto.role,
//                   CourseEnrollmentRoleModel.INSTRUCTOR,
//                 )
//               ) {
//                 totalStudents += -1;
//                 totalInstructors += 1;
//               }
//             }
//             const updatedCourse = await table.course.findUniqueOrThrow(
//               course.id,
//             );
//             expect(updatedCourse.totalStudents).toEqual(totalStudents);
//             expect(updatedCourse.totalInstructors).toEqual(totalInstructors);
//           } catch (error) {
//             if (!exception) {
//               console.log("error: ", error);
//
//               fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//             }
//
//             const updatedCourse = await table.course.findUniqueOrThrow(
//               course.id,
//             );
//             expect(updatedCourse).toEqual(course);
//
//             expect(error).toEqual(exception);
//           }
//         },
//       );
//     });
//
//     describe.only("deleteEnrollment", () => {
//       type TestArgs = {
//         enrolledUserUserRole: UserRoleModel;
//         enrollment: {
//           role: CourseEnrollmentRoleModel;
//         };
//         exception?: Error;
//       };
//       it.each([
//         {
//           enrolledUserUserRole: UserRoleModel.STUDENT,
//           enrollment: {
//             role: CourseEnrollmentRoleModel.STUDENT,
//           },
//         },
//         {
//           enrolledUserUserRole: UserRoleModel.STUDENT,
//           enrollment: {
//             role: CourseEnrollmentRoleModel.INSTRUCTOR,
//           },
//           exception: new InternalServerException(),
//         },
//         {
//           enrolledUserUserRole: UserRoleModel.INSTRUCTOR,
//           enrollment: {
//             role: CourseEnrollmentRoleModel.STUDENT,
//           },
//         },
//         {
//           enrolledUserUserRole: UserRoleModel.INSTRUCTOR,
//           enrollment: {
//             role: CourseEnrollmentRoleModel.INSTRUCTOR,
//           },
//         },
//         {
//           enrolledUserUserRole: UserRoleModel.OWNER,
//           enrollment: {
//             role: CourseEnrollmentRoleModel.STUDENT,
//           },
//         },
//         {
//           enrolledUserUserRole: UserRoleModel.OWNER,
//           enrollment: {
//             role: CourseEnrollmentRoleModel.INSTRUCTOR,
//           },
//         },
//       ] satisfies TestArgs[])(
//         "",
//         async ({
//           enrolledUserUserRole,
//           enrollment: { role: enrollmentRole },
//           exception,
//         }: TestArgs) => {
//           const { author, course, enrollment, category } =
//             await rand.courseEnrollment.generateOne({
//               authorUserRole: UserRoleModel.OWNER,
//               userRole: enrolledUserUserRole,
//               enrollmentRole: enrollmentRole,
//             });
//           const resourceId: CourseEnrollmentResourceId = {
//             userId: author.id,
//             courseId: course.id,
//           };
//
//           let totalStudents = 0;
//           let totalInstructors = 0;
//           if (
//             isEqualOrIncludeCourseEnrollmentRole(
//               enrollment.role,
//               CourseEnrollmentRoleModel.STUDENT,
//             )
//           ) {
//             totalStudents = 1;
//           }
//           if (
//             isEqualOrIncludeCourseEnrollmentRole(
//               enrollment.role,
//               CourseEnrollmentRoleModel.INSTRUCTOR,
//             )
//           ) {
//             totalInstructors = 1;
//           }
//           expect(course.totalStudents).toEqual(totalStudents);
//           expect(course.totalInstructors).toEqual(totalInstructors);
//
//           try {
//             const actual = await sut.deleteEnrollment(
//               enrollment.id,
//               resourceId,
//             );
//             expect(actual).toEqual({});
//
//             if (exception) {
//               fail(Fail.SHOULD_THROW_AN_ERROR);
//             }
//
//             const deletedEnrollment = await table.courseEnrollment.findUnique(
//               enrollment.id,
//             );
//             expect(deletedEnrollment).toBeNull();
//
//             if (
//               isEqualOrIncludeCourseEnrollmentRole(
//                 enrollmentRole,
//                 CourseEnrollmentRoleModel.STUDENT,
//               )
//             ) {
//               totalStudents = 0;
//             }
//
//             if (
//               isEqualOrIncludeCourseEnrollmentRole(
//                 enrollmentRole,
//                 CourseEnrollmentRoleModel.INSTRUCTOR,
//               )
//             ) {
//               totalInstructors = 0;
//             }
//             const updatedCourse = await table.course.findUniqueOrThrow(
//               course.id,
//             );
//             expect(updatedCourse.totalStudents).toEqual(totalStudents);
//             expect(updatedCourse.totalInstructors).toEqual(totalInstructors);
//           } catch (error) {
//             if (!exception) {
//               console.log("error: ", error);
//
//               fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//             }
//
//             const updatedCourse = await table.course.findUniqueOrThrow(
//               course.id,
//             );
//             expect(updatedCourse).toEqual(course);
//
//             expect(error).toEqual(exception);
//           }
//         },
//       );
//     });
//   });
// });
