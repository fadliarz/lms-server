import {
  CourseEnrollmentRoleModel,
  UserRoleModel,
} from "../../course/course.type";
import { Course, CourseEnrollment, Role, User } from "@prisma/client";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { ICourseLessonVideoAuthorization } from "../video.type";
import CourseLessonVideoAuthorization from "./video.authorization";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";

describe("CourseLessonVideoAuthorization Test Suite", () => {
  let authorization: ICourseLessonVideoAuthorization;

  /**
   * Create
   *
   */
  describe("CreateVideo Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonVideoAuthorization();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestParams = {
      userRole: UserRoleModel;
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
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeCreateVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).not.toThrow();
        },
      };
    }

    function getUnauthorizedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeCreateVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrow(AuthorizationException);
        },
      };
    }

    function getUnexpectedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
    ): TestCase {
      return {
        name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
          return `UnexpectedScenario: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
        },
        getRole: (): {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        } => {
          return { userRole, enrollmentRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeCreateVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrowError(InternalServerException);
        },
      };
    }

    const testCases: TestCase[] = [
      getUnauthorizedTestCase(Role.STUDENT, null),
      getUnauthorizedTestCase(Role.STUDENT, Role.STUDENT),
      getUnexpectedTestCase(Role.STUDENT, Role.INSTRUCTOR),
      getUnexpectedTestCase(Role.STUDENT, "AUTHOR"),
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
          userRole,
          enrollmentRole,
        });
      });
    });
  });

  /**
   * Get
   *
   */
  describe("GetVideo Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonVideoAuthorization();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestParams = {
      userRole: UserRoleModel;
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
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeGetVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).not.toThrow();
        },
      };
    }

    function getUnauthorizedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeGetVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrow(AuthorizationException);
        },
      };
    }

    function getUnexpectedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
    ): TestCase {
      return {
        name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
          return `UnexpectedScenario: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
        },
        getRole: (): {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        } => {
          return { userRole, enrollmentRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeGetVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrowError(InternalServerException);
        },
      };
    }

    const testCases: TestCase[] = [
      getUnauthorizedTestCase(Role.STUDENT, null),
      getAuthorizedTestCase(Role.STUDENT, Role.STUDENT),
      getUnexpectedTestCase(Role.STUDENT, Role.INSTRUCTOR),
      getUnexpectedTestCase(Role.STUDENT, "AUTHOR"),
      getUnauthorizedTestCase(Role.INSTRUCTOR, null),
      getAuthorizedTestCase(Role.INSTRUCTOR, Role.STUDENT),
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
          userRole,
          enrollmentRole,
        });
      });
    });
  });

  /**
   * Update
   *
   */
  describe("UpdateVideo Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonVideoAuthorization();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestParams = {
      userRole: UserRoleModel;
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
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeUpdateVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).not.toThrow();
        },
      };
    }

    function getUnauthorizedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeUpdateVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrow(AuthorizationException);
        },
      };
    }

    function getUnexpectedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
    ): TestCase {
      return {
        name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
          return `UnexpectedScenario: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
        },
        getRole: (): {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        } => {
          return { userRole, enrollmentRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeUpdateVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrowError(InternalServerException);
        },
      };
    }

    const testCases: TestCase[] = [
      getUnauthorizedTestCase(Role.STUDENT, null),
      getUnauthorizedTestCase(Role.STUDENT, Role.STUDENT),
      getUnexpectedTestCase(Role.STUDENT, Role.INSTRUCTOR),
      getUnexpectedTestCase(Role.STUDENT, "AUTHOR"),
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
  describe("DeleteVideo Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonVideoAuthorization();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestParams = {
      userRole: UserRoleModel;
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
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeDeleteVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).not.toThrow();
        },
      };
    }

    function getUnauthorizedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
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
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeDeleteVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrow(AuthorizationException);
        },
      };
    }

    function getUnexpectedTestCase(
      userRole: Role,
      enrollmentRole: EnrollmentRole,
    ): TestCase {
      return {
        name: (userRole: Role, enrollmentRole: EnrollmentRole): string => {
          return `UnexpectedScenario: [userRole: ${userRole}, enrollmentRole: ${enrollmentRole}]`;
        },
        getRole: (): {
          userRole: Role;
          enrollmentRole: EnrollmentRole;
        } => {
          return { userRole, enrollmentRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole, enrollmentRole } = params;
          const userId = 1;
          const authorId =
            enrollmentRole && enrollmentRole.toString() === "AUTHOR"
              ? userId
              : userId + 1;

          expect(() => {
            authorization.authorizeDeleteVideo(
              {
                id: userId,
                role: userRole,
              } as User,
              { authorId } as Course,
              enrollmentRole !== null && enrollmentRole.toString() !== "AUTHOR"
                ? ({ role: enrollmentRole } as CourseEnrollment)
                : null,
            );
          }).toThrowError(InternalServerException);
        },
      };
    }

    const testCases: TestCase[] = [
      getUnauthorizedTestCase(Role.STUDENT, null),
      getUnauthorizedTestCase(Role.STUDENT, Role.STUDENT),
      getUnexpectedTestCase(Role.STUDENT, Role.INSTRUCTOR),
      getUnexpectedTestCase(Role.STUDENT, "AUTHOR"),
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
          userRole,
          enrollmentRole,
        });
      });
    });
  });
});
