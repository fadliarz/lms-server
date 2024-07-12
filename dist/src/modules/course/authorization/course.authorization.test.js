"use strict";
// import {
//   CourseDITypes,
//   CourseEnrollmentRoleModel,
//   CourseModel,
//   ICourseAuthorization,
//   UserRoleModel,
// } from "../../course/course.type";
// import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
// import dIContainer from "../../../inversifyConfig";
// import { UserModel } from "../../user/user.type";
// import { CourseEnrollmentModel } from "../../enrollment/enrollment.type";
//
// enum Fail {
//   SHOULD_THROW_AN_ERROR = "Should throw an error",
//   SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
// }
//
// describe("CourseAuthorization Test Suites", () => {
//   let sut: ICourseAuthorization;
//
//   beforeEach(() => {
//     sut = dIContainer.get<ICourseAuthorization>(CourseDITypes.AUTHORIZATION);
//   });
//
//   /**
//    * Create
//    *
//    */
//   describe("CreateCourse Authorization", () => {
//     type TestCase = {
//       name: string;
//       userRole: UserRoleModel;
//       isAuthorized: boolean;
//     };
//     it.each([
//       {
//         name: "",
//         userRole: UserRoleModel.STUDENT,
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         userRole: UserRoleModel.STUDENT,
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         userRole: UserRoleModel.INSTRUCTOR,
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         userRole: UserRoleModel.OWNER,
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         userRole: UserRoleModel.OWNER,
//         isAuthorized: true,
//       },
//     ] satisfies TestCase[])(
//       "",
//       ({ name, userRole, isAuthorized }: TestCase) => {
//         const user = {
//           id: 1,
//           role: userRole,
//         } as UserModel;
//
//         try {
//           sut.authorizeCreateCourse(user);
//
//           if (!isAuthorized) {
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           }
//         } catch (error) {
//           if (isAuthorized) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//
//           expect(error).toBeInstanceOf(AuthorizationException);
//         }
//       },
//     );
//   });
//
//   /**
//    * Update
//    *
//    */
//   describe("UpdateCourse Authorization", () => {
//     {
//       type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
//       type TestCase = {
//         name: string;
//         role: {
//           userRole: UserRoleModel;
//           enrollmentRole: EnrollmentRole;
//         };
//         isAuthorized: boolean;
//       };
//       it.each([
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.STUDENT,
//             enrollmentRole: null,
//           },
//           isAuthorized: false,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.STUDENT,
//             enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           },
//           isAuthorized: false,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.INSTRUCTOR,
//             enrollmentRole: null,
//           },
//           isAuthorized: false,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.INSTRUCTOR,
//             enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           },
//           isAuthorized: false,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.INSTRUCTOR,
//             enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           },
//           isAuthorized: true,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.INSTRUCTOR,
//             enrollmentRole: "AUTHOR",
//           },
//           isAuthorized: true,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.OWNER,
//             enrollmentRole: null,
//           },
//           isAuthorized: true,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.OWNER,
//             enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           },
//           isAuthorized: true,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.OWNER,
//             enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           },
//           isAuthorized: true,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.OWNER,
//             enrollmentRole: "AUTHOR",
//           },
//           isAuthorized: true,
//         },
//       ] satisfies TestCase[])(
//         "",
//         ({
//           name,
//           role: { userRole, enrollmentRole },
//           isAuthorized,
//         }: TestCase) => {
//           const user = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
//           } as CourseModel;
//           const enrollment = (
//             enrollmentRole === null || enrollmentRole === "AUTHOR"
//               ? null
//               : {
//                   role: enrollmentRole,
//                 }
//           ) as CourseEnrollmentModel | null;
//
//           try {
//             sut.authorizeUpdateBasicCourse(user, course, enrollment);
//
//             if (!isAuthorized) {
//               fail(Fail.SHOULD_THROW_AN_ERROR);
//             }
//           } catch (error) {
//             if (isAuthorized) {
//               fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//             }
//
//             expect(error).toBeInstanceOf(AuthorizationException);
//           }
//         },
//       );
//     }
//   });
//
//   /**
//    * Delete
//    *
//    */
//   describe("DeleteCourse Authorization", () => {
//     type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
//     type TestCase = {
//       name: string;
//       role: {
//         userRole: UserRoleModel;
//         enrollmentRole: EnrollmentRole;
//       };
//       isAuthorized: boolean;
//     };
//     it.each([
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: "AUTHOR",
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: null,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: "AUTHOR",
//         },
//         isAuthorized: true,
//       },
//     ] satisfies TestCase[])(
//       "",
//       ({
//         name,
//         role: { userRole, enrollmentRole },
//         isAuthorized,
//       }: TestCase) => {
//         const user = {
//           id: 1,
//           role: userRole,
//         } as UserModel;
//         const course = {
//           authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
//         } as CourseModel;
//         const enrollment = (
//           enrollmentRole === null || enrollmentRole === "AUTHOR"
//             ? null
//             : {
//                 role: enrollmentRole,
//               }
//         ) as CourseEnrollmentModel | null;
//
//         try {
//           sut.authorizeDeleteCourse(user, course, enrollment);
//
//           if (!isAuthorized) {
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           }
//         } catch (error) {
//           if (isAuthorized) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//
//           expect(error).toBeInstanceOf(AuthorizationException);
//         }
//       },
//     );
//   });
//
//   /**
//    * CreateLike
//    *
//    */
//   describe("CreateLike Authorization", () => {
//     type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
//     type TestCase = {
//       name: string;
//       role: {
//         userRole: UserRoleModel;
//         enrollmentRole: EnrollmentRole;
//       };
//       isAuthorized: boolean;
//     };
//     it.each([
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: "AUTHOR",
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: "AUTHOR",
//         },
//         isAuthorized: false,
//       },
//     ] satisfies TestCase[])(
//       "",
//       ({
//         name,
//         role: { userRole, enrollmentRole },
//         isAuthorized,
//       }: TestCase) => {
//         const user = {
//           id: 1,
//           role: userRole,
//         } as UserModel;
//         const course = {
//           authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
//         } as CourseModel;
//         const enrollment = (
//           enrollmentRole === null || enrollmentRole === "AUTHOR"
//             ? null
//             : {
//                 role: enrollmentRole,
//               }
//         ) as CourseEnrollmentModel | null;
//
//         try {
//           sut.authorizeCreateLike(user, course, enrollment);
//
//           if (!isAuthorized) {
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           }
//         } catch (error) {
//           if (isAuthorized) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//
//           expect(error).toBeInstanceOf(AuthorizationException);
//         }
//       },
//     );
//   });
//
//   /**
//    * DeleteLike
//    *
//    */
//   describe("DeleteLike Authorization", () => {
//     type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
//     type TestCase = {
//       name: string;
//       role: {
//         userRole: UserRoleModel;
//         enrollmentRole: EnrollmentRole;
//       };
//       isAuthorized: boolean;
//     };
//     it.each([
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.STUDENT,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.INSTRUCTOR,
//           enrollmentRole: "AUTHOR",
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: null,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//         },
//         isAuthorized: true,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//         },
//         isAuthorized: false,
//       },
//       {
//         name: "",
//         role: {
//           userRole: UserRoleModel.OWNER,
//           enrollmentRole: "AUTHOR",
//         },
//         isAuthorized: false,
//       },
//     ] satisfies TestCase[])(
//       "",
//       ({
//         name,
//         role: { userRole, enrollmentRole },
//         isAuthorized,
//       }: TestCase) => {
//         const user = {
//           id: 1,
//           role: userRole,
//         } as UserModel;
//         const course = {
//           authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
//         } as CourseModel;
//         const enrollment = (
//           enrollmentRole === null || enrollmentRole === "AUTHOR"
//             ? null
//             : {
//                 role: enrollmentRole,
//               }
//         ) as CourseEnrollmentModel | null;
//
//         try {
//           sut.authorizeDeleteLike(user, course, enrollment);
//
//           if (!isAuthorized) {
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           }
//         } catch (error) {
//           if (isAuthorized) {
//             fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//           }
//
//           expect(error).toBeInstanceOf(AuthorizationException);
//         }
//       },
//     );
//   });
// });
