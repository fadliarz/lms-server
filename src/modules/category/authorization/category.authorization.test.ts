import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import errorMiddleware from "../../../middlewares/errorMiddleware";
import { StatusCode } from "../../../common/constants/statusCode";
import { ErrorCode } from "../../../common/constants/errorCode";
import {
  CourseCategoryAuthorizationMiddleware,
  ICourseCategoryAuthorizationMiddleware,
} from "./category.authorization";

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

describe("CourseCategoryAuthorizationMiddleware", () => {
  let middleware: ICourseCategoryAuthorizationMiddleware;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeAll(() => {
    middleware = new CourseCategoryAuthorizationMiddleware();
  });

  beforeEach(() => {
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

  /**
   * Create
   *
   */
  describe("CreateCategory Authorization", () => {
    type TestParams = {
      mockRequest: Request;
      mockResponse: Response;
      mockNext: NextFunction;
      userRole: Role;
    };
    type TestCase = {
      name: (userRole: Role | null) => string;
      getRole: () => Role;
      test: (params: TestParams) => Promise<void>;
    };

    function getUnauthorizedTestCase(userRole: Role): TestCase {
      return {
        name: (userRole: Role | null): string => {
          return `Unauthorized: [userRole: ${userRole}]`;
        },
        getRole: (): Role => {
          return userRole;
        },
        test: async (params: TestParams): Promise<void> => {
          const { mockRequest, mockResponse, mockNext, userRole } = params;

          mockNextError(mockRequest, mockResponse, mockNext);
          (
            getRequestUserOrThrowAuthenticationException as jest.Mock
          ).mockReturnValue({
            role: userRole,
          });

          await middleware.getCreateCategoryAuthorizationMiddleware()(
            mockRequest,
            mockResponse,
            mockNext
          );

          expect(mockNext).toBeCalledTimes(1);
          expect(mockNext).not.toBeCalledWith();
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

    function getAuthorizedTestCase(userRole: Role): TestCase {
      return {
        name: (userRole: Role | null): string => {
          return `Authorized: [userRole: ${userRole}]`;
        },
        getRole: (): Role => {
          return userRole;
        },
        test: async (params: TestParams): Promise<void> => {
          const { mockRequest, mockResponse, mockNext, userRole } = params;

          (
            getRequestUserOrThrowAuthenticationException as jest.Mock
          ).mockReturnValue({
            role: userRole,
          });

          await middleware.getCreateCategoryAuthorizationMiddleware()(
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
});
