import getRequestUserOrThrowAuthenticationException
    from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import {NextFunction, Request, Response} from "express";
import errorMiddleware from "../../../middlewares/errorMiddleware";
import {
    CourseAuthorizationMiddleware,
    ICourseAuthorizationMiddleware
} from "../../course/authorization/course.authorization";
import {CourseEnrollmentRole, Role} from "@prisma/client";
import {CourseLessonVideoAuthorizationMiddleware} from "./video.authorization";

jest.mock("../../../common/functions/getRequestUserOrThrowAuthenticationException")

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

    describe("CourseLessonVideoAuthorizationMiddleware", () => {
        /**
         * Create
         *
         */
        describe("CreateVideo Authorization", () => {
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
                        const lessonId = 1;

                        mockRequest.params = {
                            courseId: courseId.toString(),
                            lessonId: lessonId.toString()
                        };

                        (
                            getRequestUserOrThrowAuthenticationException as jest.Mock
                        ).mockReturnValue({
                            id: userId,
                            role: userRole,
                        });
                        jest
                            .spyOn(
                                CourseLessonVideoAuthorizationMiddleware.prototype as any,
                                "getAuthorIdOrThrow"
                            )
                            .mockResolvedValue(
                                enrollmentRole === "AUTHOR" ? userId : userId + 1
                            );
                        jest
                            .spyOn(
                                CourseLessonVideoAuthorizationMiddleware.prototype as any,
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
                }
            }
        } )
    })
})
