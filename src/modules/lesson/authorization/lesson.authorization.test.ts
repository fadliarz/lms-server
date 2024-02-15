import {
  CourseLessonDITypes,
  ICourseLessonAuthorization,
} from "../lesson.type";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
  UserRoleModel,
} from "../../course/course.type";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";
import { UserModel } from "../../user/user.type";
import { CourseEnrollmentModel } from "../../enrollment/enrollment.type";
import dIContainer from "../../../inversifyConfig";

enum Fail {
  SHOULD_THROW_AN_ERROR = "Should throw an error",
  SHOULD_NOT_THROW_AN_ERROR = "Shouldn't throw an error",
}

describe("CourseLessonAuthorization Test Suite", () => {
  let sut: ICourseLessonAuthorization;

  beforeEach(() => {
    sut = dIContainer.get<ICourseLessonAuthorization>(
      CourseLessonDITypes.AUTHORIZATION,
    );
  });

  /**
   * Create
   *
   */
  describe("CreateLesson Authorization", () => {
    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestCase = {
      name: string;
      role: {
        userRole: UserRoleModel;
        enrollmentRole: EnrollmentRole;
      };
      isAuthorized: boolean;
    };
    it.each([
      {
        name: "",
        role: {
          userRole: UserRoleModel.STUDENT,
          enrollmentRole: null,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.STUDENT,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: null,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: "AUTHOR",
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: null,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: "AUTHOR",
        },
        isAuthorized: true,
      },
    ] satisfies TestCase[])(
      "",
      ({
        name,
        role: { userRole, enrollmentRole },
        isAuthorized,
      }: TestCase) => {
        const user = {
          id: 1,
          role: userRole,
        } as UserModel;
        const course = {
          authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
        } as CourseModel;
        const enrollment = (
          enrollmentRole === null || enrollmentRole === "AUTHOR"
            ? null
            : {
                role: enrollmentRole,
              }
        ) as CourseEnrollmentModel | null;

        try {
          sut.authorizeCreateLesson(user, course, enrollment);

          if (!isAuthorized) {
            fail(Fail.SHOULD_THROW_AN_ERROR);
          }
        } catch (error) {
          if (isAuthorized) {
            fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
          }
          console.log(error);

          expect(error).toBeInstanceOf(AuthorizationException);
        }
      },
    );
  });

  /**
   * Update
   *
   */
  describe("UpdateLesson Authorization", () => {
    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestCase = {
      name: string;
      role: {
        userRole: UserRoleModel;
        enrollmentRole: EnrollmentRole;
      };
      isAuthorized: boolean;
    };
    it.each([
      {
        name: "",
        role: {
          userRole: UserRoleModel.STUDENT,
          enrollmentRole: null,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.STUDENT,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: null,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: "AUTHOR",
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: null,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: "AUTHOR",
        },
        isAuthorized: true,
      },
    ] satisfies TestCase[])(
      "",
      ({
        name,
        role: { userRole, enrollmentRole },
        isAuthorized,
      }: TestCase) => {
        const user = {
          id: 1,
          role: userRole,
        } as UserModel;
        const course = {
          authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
        } as CourseModel;
        const enrollment = (
          enrollmentRole === null || enrollmentRole === "AUTHOR"
            ? null
            : {
                role: enrollmentRole,
              }
        ) as CourseEnrollmentModel | null;

        try {
          sut.authorizeUpdateLesson(user, course, enrollment);

          if (!isAuthorized) {
            fail(Fail.SHOULD_THROW_AN_ERROR);
          }
        } catch (error) {
          if (isAuthorized) {
            fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
          }
          console.log(error);

          expect(error).toBeInstanceOf(AuthorizationException);
        }
      },
    );
  });

  /**
   * Delete
   *
   */
  describe("DeleteLesson Authorization", () => {
    type EnrollmentRole = CourseEnrollmentRoleModel | "AUTHOR" | null;
    type TestCase = {
      name: string;
      role: {
        userRole: UserRoleModel;
        enrollmentRole: EnrollmentRole;
      };
      isAuthorized: boolean;
    };
    it.each([
      {
        name: "",
        role: {
          userRole: UserRoleModel.STUDENT,
          enrollmentRole: null,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.STUDENT,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: null,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: false,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.INSTRUCTOR,
          enrollmentRole: "AUTHOR",
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: null,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: CourseEnrollmentRoleModel.STUDENT,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: CourseEnrollmentRoleModel.INSTRUCTOR,
        },
        isAuthorized: true,
      },
      {
        name: "",
        role: {
          userRole: UserRoleModel.OWNER,
          enrollmentRole: "AUTHOR",
        },
        isAuthorized: true,
      },
    ] satisfies TestCase[])(
      "",
      ({
        name,
        role: { userRole, enrollmentRole },
        isAuthorized,
      }: TestCase) => {
        const user = {
          id: 1,
          role: userRole,
        } as UserModel;
        const course = {
          authorId: enrollmentRole === "AUTHOR" ? user.id : user.id + 1,
        } as CourseModel;
        const enrollment = (
          enrollmentRole === null || enrollmentRole === "AUTHOR"
            ? null
            : {
                role: enrollmentRole,
              }
        ) as CourseEnrollmentModel | null;

        try {
          sut.authorizeDeleteLesson(user, course, enrollment);

          if (!isAuthorized) {
            fail(Fail.SHOULD_THROW_AN_ERROR);
          }
        } catch (error) {
          if (isAuthorized) {
            fail(Fail.SHOULD_NOT_THROW_AN_ERROR);
          }
          console.log(error);

          expect(error).toBeInstanceOf(AuthorizationException);
        }
      },
    );
  });
});
