"use strict";
// import "reflect-metadata";
// import { ICourseEnrollmentAuthorization } from "./enrollment.authorization";
// import dIContainer from "../../../inversifyConfig";
// import {
//   CourseEnrollmentDITypes,
//   CourseEnrollmentModel,
//   CreateCourseEnrollmentDto,
// } from "../enrollment.type";
// import {
//   CourseEnrollmentRoleModel,
//   CourseModel,
//   UserRoleModel,
// } from "../../course/course.type";
// import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
// import InternalServerException from "../../../common/class/exceptions/InternalServerException";
// import { UserModel } from "../../user/user.type";
//
// enum Fail {
//   SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
//   SHOULD_THROW_AN_ERROR = "Should throw an error",
// }
//
// describe("CourseEnrolmentAuthorization Test Suite", () => {
//   let sut: ICourseEnrollmentAuthorization;
//
//   beforeEach(() => {
//     sut = dIContainer.get<ICourseEnrollmentAuthorization>(
//       CourseEnrollmentDITypes.AUTHORIZATION,
//     );
//   });
//
//   describe("authorizeCreateEnrollment", () => {
//     describe("enrolling for themselves", () => {
//       /**
//        * Happy cases
//        *
//        */
//       type TestArgs = {
//         userRole: UserRoleModel;
//         enrollmentRole: CourseEnrollmentRoleModel;
//       };
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//       ] satisfies TestArgs[])(
//         "[userRole: $userRole, enrollmentRole: $enrollmentRole]: should create an enrollment",
//         async ({ userRole, enrollmentRole }: TestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id + 1,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id,
//             role: enrollmentRole,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).toEqual(dto.userId);
//             expect(enroller.id).not.toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//           } catch (error) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//         },
//       );
//
//       /**
//        * Sad cases
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//       ] satisfies TestArgs[])(
//         "[userRole: $userRole, enrollmentRole: $enrollmentRole]: shouldn't create an enrollment",
//         async ({ userRole, enrollmentRole }: TestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id + 1,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id,
//             role: enrollmentRole,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).toEqual(dto.userId);
//             expect(enroller.id).not.toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toEqual(expect.any(AuthorizationException));
//           }
//         },
//       );
//
//       type AuthorCaseTestArgs = {
//         userRole: UserRoleModel;
//       };
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//         },
//       ] satisfies AuthorCaseTestArgs[])(
//         "[userRole: $userRole <Author>]: shouldn't create an enrollment",
//         async ({ userRole }: AuthorCaseTestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).toEqual(dto.userId);
//             expect(enroller.id).toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toEqual(expect.any(InternalServerException));
//           }
//         },
//       );
//
//       it.each([
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//         },
//         {
//           userRole: UserRoleModel.OWNER,
//         },
//       ] satisfies AuthorCaseTestArgs[])(
//         "[userRole: $userRole <Author>]: shouldn't create an enrollment",
//         async ({ userRole }: AuthorCaseTestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).toEqual(dto.userId);
//             expect(enroller.id).toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//
//             fail("should throw error");
//           } catch (error) {
//             expect(error).toEqual(expect.any(AuthorizationException));
//           }
//         },
//       );
//     });
//
//     describe("enrolling for others", () => {
//       type TestArgs = {
//         userRole: UserRoleModel;
//       };
//
//       /**
//        * Sad cases - Unauthorized - Non Author
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//         },
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//         },
//       ] satisfies TestArgs[])(
//         "[userRole: $userRole]: shouldn't create an enrollment",
//         async ({ userRole }: TestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id + 1,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id + 2,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).not.toEqual(dto.userId);
//             expect(enroller.id).not.toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toEqual(expect.any(AuthorizationException));
//           }
//         },
//       );
//
//       /**
//        * Sad cases - Unauthorized - Author
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.INSTRUCTOR,
//         },
//       ] satisfies Omit<TestArgs, "enrollmentRole">[])(
//         "[userRole: $userRole <Author>]: shouldn't create an enrollment",
//         async ({ userRole }: Omit<TestArgs, "enrollmentRole">) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id + 1,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).not.toEqual(dto.userId);
//             expect(enroller.id).toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toEqual(expect.any(AuthorizationException));
//           }
//         },
//       );
//
//       /**
//        * Sad cases - InternalServerException
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.STUDENT,
//         },
//       ] satisfies Omit<TestArgs, "enrollmentRole">[])(
//         "[userRole: $userRole <Author>]: shouldn't create an enrollment",
//         async ({ userRole }: Omit<TestArgs, "enrollmentRole">) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id + 1,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).not.toEqual(dto.userId);
//             expect(enroller.id).toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toEqual(expect.any(InternalServerException));
//           }
//         },
//       );
//
//       /**
//        * Happy cases - Non Author
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.OWNER,
//         },
//       ] satisfies TestArgs[])(
//         "[userRole: $userRole <Author>]: should create an enrollment",
//         async ({ userRole }: TestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id + 1,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id + 2,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).not.toEqual(dto.userId);
//             expect(enroller.id).not.toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//           } catch (error) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//         },
//       );
//
//       /**
//        * Happy cases - Author
//        *
//        */
//       it.each([
//         {
//           userRole: UserRoleModel.OWNER,
//         },
//       ] satisfies TestArgs[])(
//         "[userRole: $userRole <Author>]: should create an enrollment",
//         async ({ userRole }: TestArgs) => {
//           const enroller = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enroller.id,
//           } as CourseModel;
//           const dto = {
//             userId: enroller.id + 1,
//           } as CreateCourseEnrollmentDto;
//
//           try {
//             expect(enroller.id).not.toEqual(dto.userId);
//             expect(enroller.id).toEqual(course.authorId);
//
//             await sut.authorizeCreateEnrollment(enroller, course, dto);
//           } catch (error) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//         },
//       );
//     });
//   });
//
//   describe("authorizeUpdateEnrollment", () => {
//     type TestArgs = {
//       userRole: UserRoleModel;
//       isAuthor: boolean;
//       isUpdatingForOther: boolean;
//       exception?: Error;
//     };
//     it.each([
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: false,
//         isUpdatingForOther: false,
//         exception: new AuthorizationException(),
//       },
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: false,
//         isUpdatingForOther: true,
//         exception: new AuthorizationException(),
//       },
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: true,
//         isUpdatingForOther: false,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: true,
//         isUpdatingForOther: true,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: false,
//         isUpdatingForOther: false,
//         exception: new AuthorizationException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: false,
//         isUpdatingForOther: true,
//         exception: new AuthorizationException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: true,
//         isUpdatingForOther: false,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: true,
//         isUpdatingForOther: true,
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: false,
//         isUpdatingForOther: false,
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: false,
//         isUpdatingForOther: true,
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: true,
//         isUpdatingForOther: false,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: true,
//         isUpdatingForOther: true,
//       },
//     ] satisfies TestArgs[])(
//       `[userRole: $userRole${("$isAuthor" as unknown as boolean) === true ? " <Author>]" : "]"}`,
//       async ({
//         userRole,
//         isAuthor,
//         isUpdatingForOther,
//         exception,
//       }: TestArgs) => {
//         const enroller = {
//           id: 1,
//           role: userRole,
//         } as UserModel;
//         const course = {
//           authorId: isAuthor ? enroller.id : enroller.id + 1,
//         } as CourseModel;
//         const enrollment = {
//           userId: isUpdatingForOther ? enroller.id + 2 : enroller.id,
//         } as CourseEnrollmentModel;
//
//         if (isAuthor) {
//           expect(enroller.id).toEqual(course.authorId);
//         } else {
//           expect(enroller.id).not.toEqual(course.authorId);
//         }
//
//         if (isUpdatingForOther) {
//           expect(enroller.id).not.toEqual(enrollment.userId);
//         } else {
//           expect(enroller.id).toEqual(enrollment.userId);
//         }
//
//         try {
//           await sut.authorizeUpdateEnrollmentRole(enroller, course, enrollment);
//
//           if (exception) {
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           }
//         } catch (error) {
//           if (!exception) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//
//           expect(error).toEqual(exception);
//         }
//       },
//     );
//   });
//
//   describe("authorizeDeleteEnrollment", () => {
//     type TestArgs = {
//       userRole: UserRoleModel;
//       isAuthor: boolean;
//       isDeletingForOther: boolean;
//       exception?: Error;
//     };
//     it.each([
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: false,
//         isDeletingForOther: false,
//       },
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: false,
//         isDeletingForOther: true,
//         exception: new AuthorizationException(),
//       },
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: true,
//         isDeletingForOther: false,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.STUDENT,
//         isAuthor: true,
//         isDeletingForOther: true,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: false,
//         isDeletingForOther: false,
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: false,
//         isDeletingForOther: true,
//         exception: new AuthorizationException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: true,
//         isDeletingForOther: false,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthor: true,
//         isDeletingForOther: true,
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: false,
//         isDeletingForOther: false,
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: false,
//         isDeletingForOther: true,
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: true,
//         isDeletingForOther: false,
//         exception: new InternalServerException(),
//       },
//       {
//         userRole: UserRoleModel.OWNER,
//         isAuthor: true,
//         isDeletingForOther: true,
//       },
//     ] satisfies TestArgs[])(
//       `[userRole: $userRole${("$isAuthor" as unknown as boolean) === true ? " <Author>]" : "]"}`,
//       async ({
//         userRole,
//         isAuthor,
//         isDeletingForOther,
//         exception,
//       }: TestArgs) => {
//         const enroller = {
//           id: 1,
//           role: userRole,
//         } as UserModel;
//         const course = {
//           authorId: isAuthor ? enroller.id : enroller.id + 1,
//         } as CourseModel;
//         const enrollment = {
//           userId: isDeletingForOther ? enroller.id + 2 : enroller.id,
//         } as CourseEnrollmentModel;
//
//         if (isAuthor) {
//           expect(enroller.id).toEqual(course.authorId);
//         } else {
//           expect(enroller.id).not.toEqual(course.authorId);
//         }
//
//         if (isDeletingForOther) {
//           expect(enroller.id).not.toEqual(enrollment.userId);
//         } else {
//           expect(enroller.id).toEqual(enrollment.userId);
//         }
//
//         try {
//           await sut.authorizeDeleteEnrollment(enroller, course, enrollment);
//
//           if (exception) {
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           }
//         } catch (error) {
//           if (!exception) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//
//           expect(error).toEqual(exception);
//         }
//       },
//     );
//   });
// });
