import {
  CourseEnrollmentRoleModel,
  UserRoleModel,
} from "../../course/course.type";
import { Role, User } from "@prisma/client";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import CourseCategoryAuthorization from "./category.authorization";
import { ICourseCategoryAuthorization } from "../category.type";

describe("Category Test Suite", () => {
  let authorization: ICourseCategoryAuthorization;

  /**
   * Create
   *
   */
  describe("CreateCategory Authorization", () => {
    beforeEach(() => {
      authorization = new CourseCategoryAuthorization();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    type TestParams = {
      userRole: UserRoleModel;
    };
    type TestCase = {
      name: (userRole: Role) => string;
      getRole: () => {
        userRole: Role;
      };
      test: (params: TestParams) => Promise<void>;
    };

    function getAuthorizedTestCase(userRole: Role): TestCase {
      return {
        name: (userRole: Role): string => {
          return `Authorized: [userRole: ${userRole}]`;
        },
        getRole: (): {
          userRole: Role;
        } => {
          return { userRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole } = params;
          const userId = 1;

          expect(() => {
            authorization.authorizeCreateCategory({
              id: userId,
              role: userRole,
            } as User);
          }).not.toThrow();
        },
      };
    }

    function getUnauthorizedTestCase(userRole: Role): TestCase {
      return {
        name: (userRole: Role): string => {
          return `Unauthorized: [userRole: ${userRole}]`;
        },
        getRole: (): {
          userRole: Role;
        } => {
          return { userRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole } = params;
          const userId = 1;

          expect(() => {
            authorization.authorizeCreateCategory({
              id: userId,
              role: userRole,
            } as User);
          }).toThrow(AuthorizationException);
        },
      };
    }

    const testCases: TestCase[] = [
      getUnauthorizedTestCase(UserRoleModel.STUDENT),
      getAuthorizedTestCase(UserRoleModel.INSTRUCTOR),
      getAuthorizedTestCase(UserRoleModel.OWNER),
    ];
    testCases.forEach((tc) => {
      const { userRole } = tc.getRole();
      return it(tc.name(userRole), async () => {
        await tc.test({
          userRole,
        });
      });
    });
  });

  /**
   * Update
   *
   */
  describe("UpdateCategory Authorization", () => {
    beforeEach(() => {
      authorization = new CourseCategoryAuthorization();
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    type TestParams = {
      userRole: UserRoleModel;
    };
    type TestCase = {
      name: (userRole: Role) => string;
      getRole: () => {
        userRole: Role;
      };
      test: (params: TestParams) => Promise<void>;
    };

    function getAuthorizedTestCase(userRole: Role): TestCase {
      return {
        name: (userRole: Role): string => {
          return `Authorized: [userRole: ${userRole}]`;
        },
        getRole: (): {
          userRole: Role;
        } => {
          return { userRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole } = params;
          const userId = 1;

          expect(() => {
            authorization.authorizeUpdateCategory({
              id: userId,
              role: userRole,
            } as User);
          }).not.toThrow();
        },
      };
    }

    function getUnauthorizedTestCase(userRole: Role): TestCase {
      return {
        name: (userRole: Role): string => {
          return `Unauthorized: [userRole: ${userRole}]`;
        },
        getRole: (): {
          userRole: Role;
        } => {
          return { userRole };
        },
        test: async (params: TestParams): Promise<void> => {
          const { userRole } = params;
          const userId = 1;

          expect(() => {
            authorization.authorizeUpdateCategory({
              id: userId,
              role: userRole,
            } as User);
          }).toThrow(AuthorizationException);
        },
      };
    }

    const testCases: TestCase[] = [
      getUnauthorizedTestCase(UserRoleModel.STUDENT),
      getAuthorizedTestCase(UserRoleModel.INSTRUCTOR),
      getAuthorizedTestCase(UserRoleModel.OWNER),
    ];
    testCases.forEach((tc) => {
      const { userRole } = tc.getRole();
      return it(tc.name(userRole), async () => {
        await tc.test({
          userRole,
        });
      });
    });
  });
});
