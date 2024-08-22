// import "reflect-metadata";
// import {
//   CourseEnrollmentRoleModel,
//   CourseModel,
//   UserRoleModel,
// } from "../../modules/course/course.type";
// import { UserModel } from "../../modules/user/user.type";
// import { CourseEnrollmentModel } from "../../modules/enrollment/enrollment.type";
// import InternalServerException from "./exceptions/InternalServerException";
// import BaseAuthorization, {
//   BaseAuthorizationDITypes,
// } from "./BaseAuthorization";
// import dIContainer from "../../inversifyConfig";
// import {
//   ICourseEnrollmentPrismaQueryRaw,
//   ICoursePrismaQueryRaw,
//   IUserPrismaQueryRaw,
//   PrismaQueryRawDITypes,
// } from "./prisma_query_raw/prisma_query_raw.type";
// import UserPrismaQueryRaw from "./prisma_query_raw/UserPrismaQueryRaw";
// import * as GetRoleStatusModel from "../functions/getRoleStatus";
// import CoursePrismaQueryRaw from "./prisma_query_raw/CoursePrismaQueryRaw";
// import CourseEnrollmentPrismaQueryRaw from "./prisma_query_raw/CourseEnrollmentPrismaQueryRaw";
//
// enum Fail {
//   SHOULD_THROW_AN_ERROR = "Should throw an error",
//   SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
// }
//
// function mockGetRoleStatusReturnValueOnce(returnValue: any): void {
//   jest.spyOn(GetRoleStatusModel, "default").mockReturnValueOnce(returnValue);
// }
//
// const mockUserSelectForUpdateByIdOrThrow = jest.fn();
// const mockCourseSelectForUpdateByIdOrThrow = jest.fn();
// const mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId = jest.fn();
//
// describe("BaseAuthorizaion Test Suites", () => {
//   let sut: BaseAuthorization;
//
//   beforeAll(() => {
//     dIContainer.unbind(PrismaQueryRawDITypes.USER);
//     dIContainer
//       .bind<IUserPrismaQueryRaw>(PrismaQueryRawDITypes.USER)
//       .toConstantValue({
//         selectForUpdateByIdOrThrow: mockUserSelectForUpdateByIdOrThrow,
//       } as unknown as IUserPrismaQueryRaw);
//     dIContainer.unbind(PrismaQueryRawDITypes.COURSE);
//     dIContainer
//       .bind<ICoursePrismaQueryRaw>(PrismaQueryRawDITypes.COURSE)
//       .toConstantValue({
//         selectForUpdateByIdOrThrow: mockCourseSelectForUpdateByIdOrThrow,
//       } as unknown as ICoursePrismaQueryRaw);
//     dIContainer.unbind(PrismaQueryRawDITypes.COURSE_ENROLLMENT);
//     dIContainer
//       .bind<ICourseEnrollmentPrismaQueryRaw>(
//         PrismaQueryRawDITypes.COURSE_ENROLLMENT,
//       )
//       .toConstantValue({
//         selectForUpdateByUserIdAndCourseId:
//           mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId,
//       } as unknown as ICourseEnrollmentPrismaQueryRaw);
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(PrismaQueryRawDITypes.USER);
//     dIContainer
//       .bind<IUserPrismaQueryRaw>(PrismaQueryRawDITypes.USER)
//       .to(UserPrismaQueryRaw);
//     dIContainer.unbind(PrismaQueryRawDITypes.COURSE);
//     dIContainer
//       .bind<ICoursePrismaQueryRaw>(PrismaQueryRawDITypes.COURSE)
//       .to(CoursePrismaQueryRaw);
//     dIContainer.unbind(PrismaQueryRawDITypes.COURSE_ENROLLMENT);
//     dIContainer
//       .bind<ICourseEnrollmentPrismaQueryRaw>(
//         PrismaQueryRawDITypes.COURSE_ENROLLMENT,
//       )
//       .to(CourseEnrollmentPrismaQueryRaw);
//   });
//
//   beforeEach(() => {
//     sut = dIContainer.get<BaseAuthorization>(BaseAuthorizationDITypes);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("authorizeUserRole", () => {
//     {
//       type TestCase = {
//         isStudent: boolean;
//         isInstructor: boolean;
//         isAdmin: boolean;
//       };
//       it.each([
//         { isStudent: true, isInstructor: false, isAdmin: false },
//         { isStudent: false, isInstructor: true, isAdmin: false },
//         { isStudent: false, isInstructor: false, isAdmin: true },
//       ] satisfies TestCase[])("", async (tc: TestCase) => {
//         const user = {};
//         mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
//         const func = jest.fn();
//
//         mockGetRoleStatusReturnValueOnce(tc);
//
//         try {
//           const actual = await sut.authorizeUserRole(
//             {} as any,
//             {} as any,
//             func,
//           );
//
//           expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
//           expect(func).toBeCalledTimes(1);
//           expect(user).toEqual(actual);
//         } catch (error) {
//           fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//         }
//       });
//     }
//
//     {
//       type TestCase = {
//         isStudent: boolean;
//         isInstructor: boolean;
//         isAdmin: boolean;
//       };
//       it.each([
//         { isStudent: false, isInstructor: false, isAdmin: false },
//       ] satisfies TestCase[])("", async (tc: TestCase) => {
//         const func = jest.fn();
//         const user = {};
//         mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
//
//         mockGetRoleStatusReturnValueOnce(tc);
//
//         try {
//           await sut.authorizeUserRole({} as any, {} as any, func);
//
//           fail(Fail.SHOULD_THROW_AN_ERROR);
//         } catch (error) {
//           expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
//           expect(func).not.toBeCalled();
//           expect(error).toBeInstanceOf(InternalServerException);
//         }
//       });
//     }
//   });
//
//   describe("authorize", () => {
//     {
//       type TestCase = {
//         isStudent: boolean;
//         isInstructor: boolean;
//         isAdmin: boolean;
//       };
//       it.each([
//         { isStudent: true, isInstructor: false, isAdmin: false },
//         { isStudent: false, isInstructor: true, isAdmin: false },
//         { isStudent: false, isInstructor: false, isAdmin: true },
//       ] satisfies TestCase[])("", async (tc: TestCase) => {
//         const user = {};
//         const course = {};
//         const enrollment = {};
//         mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
//         mockCourseSelectForUpdateByIdOrThrow.mockReturnValueOnce(course);
//         mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId.mockReturnValueOnce(
//           enrollment,
//         );
//         const func = jest.fn();
//
//         mockGetRoleStatusReturnValueOnce(tc);
//
//         try {
//           const actual = await sut.authorize({} as any, {} as any, func);
//
//           expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
//           expect(mockCourseSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
//           expect(
//             mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId,
//           ).toBeCalledTimes(1);
//           expect(func).toBeCalledTimes(1);
//           expect({ user, course, enrollment }).toEqual(actual);
//         } catch (error) {
//           fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
//         }
//       });
//     }
//
//     {
//       type TestCase = {
//         isStudent: boolean;
//         isInstructor: boolean;
//         isAdmin: boolean;
//       };
//       it.each([
//         { isStudent: false, isInstructor: false, isAdmin: false },
//       ] satisfies TestCase[])("", async (tc: TestCase) => {
//         const user = {};
//         const course = {};
//         const enrollment = {};
//         mockUserSelectForUpdateByIdOrThrow.mockReturnValueOnce(user);
//         mockCourseSelectForUpdateByIdOrThrow.mockReturnValueOnce(course);
//         mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId.mockReturnValueOnce(
//           enrollment,
//         );
//         const func = jest.fn();
//
//         mockGetRoleStatusReturnValueOnce(tc);
//
//         try {
//           await sut.authorize({} as any, {} as any, func);
//
//           fail(Fail.SHOULD_THROW_AN_ERROR);
//         } catch (error) {
//           expect(mockUserSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
//           expect(mockCourseSelectForUpdateByIdOrThrow).toBeCalledTimes(1);
//           expect(
//             mockCourseEnrollmentSelectForUpdateByUserIdAndCourseId,
//           ).toBeCalledTimes(1);
//           expect(func).not.toBeCalled();
//           expect(error).toBeInstanceOf(InternalServerException);
//         }
//       });
//     }
//   });
//
//   describe("validateUnexpectedScenarios", () => {
//     {
//       type EnrollmentRole = CourseEnrollmentRoleModel | null;
//       type TestCase = {
//         name: string;
//         role: {
//           userRole: UserRoleModel;
//           enrollmentRole: EnrollmentRole;
//         };
//         isAuthor: boolean;
//       };
//       it.each([
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.STUDENT,
//             enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
//           },
//           isAuthor: false,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.STUDENT,
//             enrollmentRole: null,
//           },
//           isAuthor: true,
//         },
//         {
//           name: "",
//           role: {
//             userRole: UserRoleModel.INSTRUCTOR,
//             enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
//           },
//           isAuthor: true,
//         },
//       ] satisfies TestCase[])(
//         "",
//         ({ name, role: { userRole, enrollmentRole }, isAuthor }: TestCase) => {
//           const user = {
//             id: 1,
//             role: userRole,
//           } as UserModel;
//           const course = {
//             authorId: isAuthor ? user.id : user.id + 1,
//           } as CourseModel;
//           const enrollment = (
//             enrollmentRole === null
//               ? null
//               : {
//                   role: enrollmentRole,
//                 }
//           ) as CourseEnrollmentModel | null;
//
//           try {
//             sut.validateUnexpectedScenarios(user, course, enrollment);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toBeInstanceOf(InternalServerException);
//           }
//         },
//       );
//
//       {
//         type TestCase = {
//           isStudent: boolean;
//           isInstructor: boolean;
//           isAdmin: boolean;
//         };
//         it.each([
//           { isStudent: false, isInstructor: false, isAdmin: false },
//         ] satisfies TestCase[])("", async (tc: TestCase) => {
//           mockGetRoleStatusReturnValueOnce(tc);
//
//           try {
//             sut.validateUnexpectedScenarios("" as any, "" as any, "" as any);
//
//             fail(Fail.SHOULD_THROW_AN_ERROR);
//           } catch (error) {
//             expect(error).toBeInstanceOf(InternalServerException);
//           }
//         });
//       }
//     }
//   });
// });
