import { Course, CourseEnrollment, Role, User } from "@prisma/client";
import CourseLessonAuthorization from "./lesson.authorization";
import { ICourseLessonAuthorization } from "../lesson.type";
import {
  CourseEnrollmentRoleModel,
  UserRoleModel,
} from "../../course/course.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

describe("CourseAuthorization Test Suite", () => {
  let authorization: ICourseLessonAuthorization;

  /**
   * Create
   *
   */
  describe("CreateLesson Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonAuthorization();
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
            authorization.authorizeCreateLesson(
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
            authorization.authorizeCreateLesson(
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
  describe("DeleteLesson Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonAuthorization();
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
            authorization.authorizeDeleteLesson(
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
            authorization.authorizeDeleteLesson(
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
  describe("UpdateLesson Authorization", () => {
    beforeEach(() => {
      authorization = new CourseLessonAuthorization();
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
            authorization.authorizeUpdateLesson(
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
            authorization.authorizeUpdateLesson(
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
          userRole,
          enrollmentRole,
        });
      });
    });
  });
});
