import {
  CourseAuthorizationMiddleware,
  ICourseAuthorizationMiddleware,
} from "./course.authorization";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Request, Response, NextFunction } from "express";
import { CourseEnrollmentRole, Role } from "@prisma/client";
import errorMiddleware from "../../../middlewares/errorMiddleware";
import { StatusCode } from "../../../common/constants/statusCode";
import { ErrorCode } from "../../../common/constants/errorCode";
import HttpException from "../../../common/class/exceptions/HttpException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

jest.mock(
  "../../../common/functions/getRequestUserOrThrowAuthenticationException"
);

/**
 *
 * @param mockRequest
 * @param mockResponse
 * @param next
 *
 * Mock next() function so it can simulates real wold scenario.
 */
function mockNextError(
  mockRequest: Request,
  mockResponse: Response,
  mockNext: NextFunction
): void {
  (mockNext as jest.Mock).mockImplementation((error: Error) => {
    errorMiddleware(error, mockRequest, mockResponse, mockNext);
  });
}

describe("", () => {
  let middleware: ICourseAuthorizationMiddleware;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new CourseAuthorizationMiddleware();
    mockRequest = {} as Request;
    mockResponse = {
      status: jest.fn(() => mockResponse),
      json: jest.fn(),
    } as any as Response;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("CourseAuthorizationMiddleware", () => {
    /**
     * Create
     *
     */
    describe("CreateCourse Authorization", () => {
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
        userRole: Role;
      };
      type TestCase = {
        name: (userRole: Role) => string;
        getRole: () => Role;
        test: (params: TestParams) => Promise<void>;
      };

      function getAuthorizedTestCase(role: Role): TestCase {
        return {
          name: (userRole: Role): string => {
            return `Authorized: [userRole: ${userRole}]`;
          },
          getRole: (): Role => {
            return role;
          },
          test: async (params: TestParams): Promise<void> => {
            const { mockRequest, mockResponse, mockNext, userRole } = params;

            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              role: userRole,
            });

            await middleware.getCreateCourseAuthorizationMiddleware()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
          },
        };
      }

      function getUnauthorizedTestCase(role: Role): TestCase {
        return {
          name: (userRole: Role): string => {
            return `Unauthorized: [userRole: ${userRole}]`;
          },
          getRole: (): Role => {
            return role;
          },
          test: async (params: TestParams): Promise<void> => {
            const { mockRequest, mockResponse, mockNext, userRole } = params;

            mockNextError(mockRequest, mockResponse, mockNext);
            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              role: userRole,
            });

            await middleware.getCreateCourseAuthorizationMiddleware()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.UNAUTHORIZED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({
              error: {
                errorCode: ErrorCode.UNAUTHORIZED,
                message: expect.any(String),
              },
            });
          },
        };
      }

      const testCases: TestCase[] = [
        getUnauthorizedTestCase(Role.STUDENT),
        getAuthorizedTestCase(Role.INSTRUCTOR),
        getAuthorizedTestCase(Role.OWNER),
      ];
      testCases.forEach((tc) => {
        const userRole = tc.getRole();
        return it(tc.name(userRole), async () => {
          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
            userRole,
          });
        });
      });
    });

    /**
     * Update
     *
     */
    describe("UpdateCourse Authorization", () => {
      type EnrollmentRole = CourseEnrollmentRole | "AUTHOR" | null;
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
        userRole: Role;
        enrollmentRole: EnrollmentRole;
      };
      type TestCase = {
        name: (userRole: Role, enrollmentRole: EnrollmentRole) => string;
        getRole: () => {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        };
        test: (params: TestParams) => Promise<void>;
      };

      function getAuthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Authorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
            };

            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getAuthorIdOrThrow"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? userId : userId + 1
              );
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getEnrollmentRoleById"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? null : enrollmentRole
              );

            await middleware.getUpdateCourseAuthorizationMiddleware()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
          },
        };
      }

      function getUnauthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Unauthorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
            };

            mockNextError(mockRequest, mockResponse, mockNext);
            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getAuthorIdOrThrow"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? userId : userId + 1
              );
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getEnrollmentRoleById"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? null : enrollmentRole
              );

            await middleware.getUpdateCourseAuthorizationMiddleware()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.UNAUTHORIZED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({
              error: {
                errorCode: ErrorCode.UNAUTHORIZED,
                message: expect.any(String),
              },
            });
          },
        };
      }

      const testCases: TestCase[] = [
        getUnauthorizedTestCase(Role.STUDENT, null),
        getUnauthorizedTestCase(Role.STUDENT, Role.STUDENT),
        getUnauthorizedTestCase(Role.STUDENT, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.STUDENT, "AUTHOR"),
        getUnauthorizedTestCase(Role.INSTRUCTOR, null),
        getUnauthorizedTestCase(Role.INSTRUCTOR, Role.STUDENT),
        getAuthorizedTestCase(Role.INSTRUCTOR, Role.INSTRUCTOR),
        getAuthorizedTestCase(Role.INSTRUCTOR, "AUTHOR"),
        getAuthorizedTestCase(Role.OWNER, null),
        getAuthorizedTestCase(Role.OWNER, Role.STUDENT),
        getAuthorizedTestCase(Role.OWNER, Role.INSTRUCTOR),
        getAuthorizedTestCase(Role.OWNER, "AUTHOR"),
      ];
      testCases.forEach((tc) => {
        const { userRole, enrollmentRole } = tc.getRole();
        return it(tc.name(userRole, enrollmentRole), async () => {
          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
            userRole,
            enrollmentRole,
          });
        });
      });
    });

    /**
     * Delete
     *
     */
    describe("DeleteCourse Authorization", () => {
      type EnrollmentRole = Exclude<Role, "OWNER"> | "AUTHOR" | null;
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
        userRole: Role;
        enrollmentRole: EnrollmentRole;
      };
      type TestCase = {
        name: (userRole: Role, enrollmentRole: EnrollmentRole) => string;
        getRole: () => {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        };
        test: (params: TestParams) => Promise<void>;
      };

      function getAuthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Authorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
            };

            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getAuthorIdOrThrow"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? userId : userId + 1
              );

            await middleware.getDeleteCourseAuthorizationMiddleware()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
          },
        };
      }

      function getUnauthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Unauthorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
            };

            mockNextError(mockRequest, mockResponse, mockNext);
            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getAuthorIdOrThrow"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? userId : userId + 1
              );

            await middleware.getDeleteCourseAuthorizationMiddleware()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.UNAUTHORIZED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({
              error: {
                errorCode: ErrorCode.UNAUTHORIZED,
                message: expect.any(String),
              },
            });
          },
        };
      }

      const testCases: TestCase[] = [
        getUnauthorizedTestCase(Role.STUDENT, null),
        getUnauthorizedTestCase(Role.STUDENT, Role.STUDENT),
        getUnauthorizedTestCase(Role.STUDENT, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.STUDENT, "AUTHOR"),
        getUnauthorizedTestCase(Role.INSTRUCTOR, null),
        getUnauthorizedTestCase(Role.INSTRUCTOR, Role.STUDENT),
        getUnauthorizedTestCase(Role.INSTRUCTOR, Role.INSTRUCTOR),
        getAuthorizedTestCase(Role.INSTRUCTOR, "AUTHOR"),
        getAuthorizedTestCase(Role.OWNER, null),
        getAuthorizedTestCase(Role.OWNER, Role.STUDENT),
        getAuthorizedTestCase(Role.OWNER, Role.INSTRUCTOR),
        getAuthorizedTestCase(Role.OWNER, "AUTHOR"),
      ];
      testCases.forEach((tc) => {
        const { userRole, enrollmentRole } = tc.getRole();
        return it(tc.name(userRole, enrollmentRole), async () => {
          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
            userRole,
            enrollmentRole,
          });
        });
      });
    });
  });

  describe("CourseLikeAuthorizationMiddleware", () => {
    describe("CreateLike Authorization", () => {
      type EnrollmentRole = Exclude<Role, "OWNER"> | "AUTHOR" | null;
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
        userRole: Role;
        enrollmentRole: EnrollmentRole;
      };
      type TestCase = {
        name: (userRole: Role, enrollmentRole: EnrollmentRole) => string;
        getRole: () => {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        };
        test: (params: TestParams) => Promise<void>;
      };

      function getAuthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Authorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
            };

            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getEnrollmentRoleById"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? null : enrollmentRole
              );

            await middleware.getCreateCourseLikeAuthorization()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
          },
        };
      }

      function getUnauthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Unauthorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
            };

            mockNextError(mockRequest, mockResponse, mockNext);
            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });
            jest
              .spyOn(
                CourseAuthorizationMiddleware.prototype as any,
                "getEnrollmentRoleById"
              )
              .mockResolvedValue(
                enrollmentRole === "AUTHOR" ? null : enrollmentRole
              );

            await middleware.getCreateCourseLikeAuthorization()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(expect.any(HttpException));
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.UNAUTHORIZED);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({
              error: {
                errorCode: ErrorCode.UNAUTHORIZED,
                message: expect.any(String),
              },
            });
          },
        };
      }

      const testCases: TestCase[] = [
        getUnauthorizedTestCase(Role.STUDENT, null),
        getAuthorizedTestCase(Role.STUDENT, Role.STUDENT),
        getUnauthorizedTestCase(Role.STUDENT, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.STUDENT, "AUTHOR"),
        getUnauthorizedTestCase(Role.INSTRUCTOR, null),
        getAuthorizedTestCase(Role.INSTRUCTOR, Role.STUDENT),
        getUnauthorizedTestCase(Role.INSTRUCTOR, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.INSTRUCTOR, "AUTHOR"),
        getAuthorizedTestCase(Role.OWNER, null),
        getAuthorizedTestCase(Role.OWNER, Role.STUDENT),
        getAuthorizedTestCase(Role.OWNER, Role.INSTRUCTOR),
        getAuthorizedTestCase(Role.OWNER, "AUTHOR"),
      ];
      testCases.forEach((tc) => {
        const { userRole, enrollmentRole } = tc.getRole();
        return it(tc.name(userRole, enrollmentRole), async () => {
          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
            userRole,
            enrollmentRole,
          });
        });
      });
    });

    describe("DeleteLike Authorization", () => {
      type EnrollmentRole = Exclude<Role, "OWNER"> | "AUTHOR" | null;
      type TestParams = {
        mockRequest: Request;
        mockResponse: Response;
        mockNext: NextFunction;
        userRole: Role;
        enrollmentRole: EnrollmentRole;
      };
      type TestCase = {
        name: (userRole: Role, enrollmentRole: EnrollmentRole) => string;
        getRole: () => {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        };
        test: (params: TestParams) => Promise<void>;
      };

      function getAuthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Authorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;
            const likeId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
              likeId: likeId.toString(),
            };

            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });

            if (
              enrollmentRole !== null &&
              enrollmentRole !== "AUTHOR" &&
              isEqualOrIncludeRole(enrollmentRole, [Role.STUDENT])
            ) {
              jest
                .spyOn(
                  CourseAuthorizationMiddleware.prototype as any,
                  "getLikeByIdOrThrow"
                )
                .mockResolvedValue({});
            } else {
              jest
                .spyOn(
                  CourseAuthorizationMiddleware.prototype as any,
                  "getLikeByIdOrThrow"
                )
                .mockRejectedValue(new RecordNotFoundException());
            }

            await middleware.getDeleteCourseLikeAuthorization()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith();
            expect(mockResponse.status).not.toBeCalled();
            expect(mockResponse.json).not.toBeCalled();
          },
        };
      }

      function getUnauthorizedTestCase(
        userRole: Role,
        enrollmentRole: EnrollmentRole
      ): TestCase {
        return {
          name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
            return `Unauthorized: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
          },
          getRole: (): {
            userRole: Role;
            enrollmentRole: EnrollmentRole;
          } => {
            return { userRole, enrollmentRole };
          },
          test: async (params: TestParams): Promise<void> => {
            const {
              mockRequest,
              mockResponse,
              mockNext,
              userRole,
              enrollmentRole,
            } = params;
            const userId = 1;
            const courseId = 1;
            const likeId = 1;

            mockRequest.params = {
              courseId: courseId.toString(),
              likeId: likeId.toString(),
            };

            mockNextError(mockRequest, mockResponse, mockNext);
            (
              getRequestUserOrThrowAuthenticationException as jest.Mock
            ).mockReturnValue({
              id: userId,
              role: userRole,
            });

            if (
              enrollmentRole !== null &&
              enrollmentRole !== "AUTHOR" &&
              isEqualOrIncludeRole(enrollmentRole, [Role.STUDENT])
            ) {
              jest
                .spyOn(
                  CourseAuthorizationMiddleware.prototype as any,
                  "getLikeByIdOrThrow"
                )
                .mockResolvedValue({});
            } else {
              jest
                .spyOn(
                  CourseAuthorizationMiddleware.prototype as any,
                  "getLikeByIdOrThrow"
                )
                .mockRejectedValue(new RecordNotFoundException());
            }

            await middleware.getDeleteCourseLikeAuthorization()(
              mockRequest,
              mockResponse,
              mockNext
            );

            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(
              expect.any(RecordNotFoundException)
            );
            expect(mockResponse.status).toBeCalledTimes(1);
            expect(mockResponse.status).toBeCalledWith(StatusCode.NOT_FOUND);
            expect(mockResponse.json).toBeCalledTimes(1);
            expect(mockResponse.json).toBeCalledWith({
              error: {
                errorCode: ErrorCode.RESOURCE_NOT_FOUND,
                message: expect.any(String),
              },
            });
          },
        };
      }

      const testCases: TestCase[] = [
        getUnauthorizedTestCase(Role.STUDENT, null),
        getAuthorizedTestCase(Role.STUDENT, Role.STUDENT),
        getUnauthorizedTestCase(Role.STUDENT, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.STUDENT, "AUTHOR"),
        getUnauthorizedTestCase(Role.INSTRUCTOR, null),
        getAuthorizedTestCase(Role.INSTRUCTOR, Role.STUDENT),
        getUnauthorizedTestCase(Role.INSTRUCTOR, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.INSTRUCTOR, "AUTHOR"),
        getUnauthorizedTestCase(Role.OWNER, null),
        getAuthorizedTestCase(Role.OWNER, Role.STUDENT),
        getUnauthorizedTestCase(Role.OWNER, Role.INSTRUCTOR),
        getUnauthorizedTestCase(Role.OWNER, "AUTHOR"),
      ];
      testCases.forEach((tc) => {
        const { userRole, enrollmentRole } = tc.getRole();
        return it(tc.name(userRole, enrollmentRole), async () => {
          await tc.test({
            mockRequest,
            mockResponse,
            mockNext,
            userRole,
            enrollmentRole,
          });
        });
      });
    });
  });
});
