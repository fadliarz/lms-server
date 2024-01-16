import "reflect-metadata"

import {
  CourseAuthorizationMiddleware,
  ICourseAuthorizationMiddleware,
} from "./course.authorization";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import AuthorizationException from "../../../common/exceptions/AuthorizationException";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";

jest.mock(
  "../../../common/functions/getRequestUserOrThrowAuthenticationException"
);

describe("Course Authorization Middleware", () => {
  let middleware: ICourseAuthorizationMiddleware;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  /**
   *
   *
   * Course
   *
   *
   */
  /**
   * Create
   *
   */
  function getCreateCoursePassIt(userRole: Role) {
    return it(`should pass authorization for [userRole: ${userRole}]`, async () => {
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({
        role: userRole,
      });

      await expect(
        middleware.getCreateCourseAuthorizationMiddleware()(req, res, next)
      ).resolves;
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });
  }

  function getCreateCourseThrowIt(
    userRole: Role,
    objectClass: any,
    exception: string
  ) {
    return it(`should throw ${exception} for [userRole: ${userRole}]`, async () => {
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({
        role: userRole,
      });
      (next as jest.Mock).mockImplementation(() => {
        throw new objectClass();
      });

      await expect(
        middleware.getCreateCourseAuthorizationMiddleware()(req, res, next)
      ).rejects.toThrow(objectClass);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  /**
   * Update
   *
   */
  function getUpdateCoursePassIt(
    userRole: Role,
    enrollmentRole: Role | null | "AUTHOR"
  ) {
    return it(`should pass authorization for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      req.params = {
        courseId: "1",
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: 1, role: enrollmentRole });

      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getAuthorIdOrThrow"
        )
        .mockResolvedValue(enrollmentRole === "AUTHOR" ? 1 : 2);
      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getEnrollmentRoleById"
        )
        .mockResolvedValue(enrollmentRole === "AUTHOR" ? null : enrollmentRole);

      await expect(
        middleware.getUpdateCourseAuthorizationMiddleware()(req, res, next)
      ).resolves.toBe(undefined);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  function getUpdateCourseThrowIt(
    userRole: Role,
    enrollmentRole: Role | null,
    objectClass: any,
    exception: string
  ) {
    return it(`should throw ${exception} for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      req.params = {
        courseId: "1",
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: 1, role: userRole });

      (next as jest.Mock).mockImplementation(() => {
        throw new objectClass();
      });

      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getAuthorIdOrThrow"
        )
        .mockResolvedValue(2);
      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getEnrollmentRoleById"
        )
        .mockResolvedValue(enrollmentRole);

      await expect(
        middleware.getUpdateCourseAuthorizationMiddleware()(req, res, next)
      ).rejects.toThrow(objectClass);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  /**
   * Delete
   *
   */
  function getDeleteCoursePassIt(
    userRole: Role,
    enrollmentRole: Role | null | "AUTHOR"
  ) {
    return it(`should pass authorization for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      req.params = {
        courseId: "1",
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: 1, role: enrollmentRole });

      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getAuthorIdOrThrow"
        )
        .mockResolvedValue(enrollmentRole === "AUTHOR" ? 1 : 2);

      await expect(
        middleware.getDeleteCourseAuthorizationMiddleware()(req, res, next)
      ).resolves.toBe(undefined);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  function getDeleteCourseThrowIt(
    userRole: Role,
    enrollmentRole: Role | null,
    objectClass: any,
    exception: string
  ) {
    return it(`should throw ${exception} for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      req.params = {
        courseId: "1",
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: 1, role: userRole });

      (next as jest.Mock).mockImplementation(() => {
        throw new objectClass();
      });

      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getAuthorIdOrThrow"
        )
        .mockResolvedValue(2);

      await expect(
        middleware.getDeleteCourseAuthorizationMiddleware()(req, res, next)
      ).rejects.toThrow(objectClass);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  /**
   *
   *
   * CourseLike
   *
   *
   */
  /**
   * Create
   *
   */
  function getCreateCourseLikePassIt(
    userRole: Role,
    enrollmentRole: Role | null | "AUTHOR"
  ) {
    return it(`should pass authorization for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      const userId = 1;
      const courseId = 1;
      req.params = {
        courseId: courseId.toString(),
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: userId, role: userRole });

      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getEnrollmentById"
        )
        .mockResolvedValue({
          userId,
          courseId,
          role: enrollmentRole,
        });

      await expect(
        middleware.getUpdateCourseAuthorizationMiddleware()(req, res, next)
      ).resolves.toBe(undefined);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  function getCreateCourseLikeThrowIt(
    userRole: Role,
    enrollmentRole: Role | null | "AUTHOR",
    objectClass: any,
    exception: string
  ) {
    return it(`should throw ${exception} for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      const userId = 1;
      const courseId = 1;
      req.params = {
        courseId: courseId.toString(),
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: userId, role: userRole });

      (next as jest.Mock).mockImplementation(() => {
        throw new objectClass();
      });

      jest
        .spyOn(
          CourseAuthorizationMiddleware.prototype as any,
          "getEnrollmentById"
        )
        .mockResolvedValue(
          enrollmentRole === "AUTHOR"
            ? null
            : {
                userId,
                courseId,
                role: enrollmentRole,
              }
        );

      await expect(
        middleware.getUpdateCourseAuthorizationMiddleware()(req, res, next)
      ).rejects.toThrow(objectClass);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  /**
   * Delete
   *
   */
  function getDeleteCourseLikePassIt(
    userRole: Role,
    enrollmentRole: Role | null | "AUTHOR"
  ) {
    return it(`should pass authorization for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      const userId = 1;
      const courseId = 1;
      const likeId = 1;
      req.params = {
        courseId: courseId.toString(),
        likeId: likeId.toString(),
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: userId, role: userRole });

      jest
        .spyOn(CourseAuthorizationMiddleware.prototype as any, "getLikeById")
        .mockResolvedValue(
          enrollmentRole !== "AUTHOR" &&
            enrollmentRole !== null &&
            isEqualOrIncludeRole(enrollmentRole, Role.STUDENT)
            ? { userId, courseId }
            : null
        );

      await expect(
        middleware.getUpdateCourseAuthorizationMiddleware()(req, res, next)
      ).resolves.toBe(undefined);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  function getDeleteCourseLikeThrowIt(
    userRole: Role,
    enrollmentRole: Role | null | "AUTHOR",
    objectClass: any,
    exception: string
  ) {
    return it(`should throw ${exception} for [userRole: ${userRole}, enrollmentRole: ${
      enrollmentRole ? enrollmentRole : "-"
    }]`, async () => {
      const userId = 1;
      const courseId = 1;
      const likeId = 1;
      req.params = {
        courseId: courseId.toString(),
        likeId: likeId.toString(),
      };
      (
        getRequestUserOrThrowAuthenticationException as jest.Mock
      ).mockReturnValue({ id: userId, role: userRole });

      (next as jest.Mock).mockImplementation(() => {
        throw new objectClass();
      });

      jest
        .spyOn(CourseAuthorizationMiddleware.prototype as any, "getLikeById")
        .mockResolvedValue(
          enrollmentRole !== "AUTHOR" &&
            enrollmentRole !== null &&
            isEqualOrIncludeRole(enrollmentRole, Role.STUDENT)
            ? { userId, courseId }
            : null
        );

      await expect(
        middleware.getUpdateCourseAuthorizationMiddleware()(req, res, next)
      ).rejects.toThrow(objectClass);
      expect(next).toHaveBeenCalledTimes(1);
    });
  }

  beforeEach(() => {
    middleware = new CourseAuthorizationMiddleware();
    req = {} as Request;
    res = {} as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("CreateCourse Authorization Middleware", () => {
    getCreateCourseThrowIt(
      Role.STUDENT,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCoursePassIt(Role.INSTRUCTOR);
    getCreateCoursePassIt(Role.OWNER);
  });

  describe("UpdateCourse Authorization Middleware", () => {
    /**
     * Student
     *
     */
    getUpdateCourseThrowIt(
      Role.STUDENT,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getUpdateCourseThrowIt(
      Role.STUDENT,
      Role.STUDENT,
      AuthorizationException,
      "AuthorizationException"
    );
    getUpdateCourseThrowIt(
      Role.STUDENT,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Instructor
     *
     */
    getUpdateCourseThrowIt(
      Role.INSTRUCTOR,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getUpdateCourseThrowIt(
      Role.INSTRUCTOR,
      Role.STUDENT,
      AuthorizationException,
      "AuthorizationException"
    );
    getUpdateCoursePassIt(Role.INSTRUCTOR, Role.INSTRUCTOR);
    getUpdateCoursePassIt(Role.INSTRUCTOR, "AUTHOR");
    /**
     * Admin
     *
     */
    getUpdateCoursePassIt(Role.OWNER, null);
    getUpdateCoursePassIt(Role.OWNER, Role.STUDENT);
    getUpdateCoursePassIt(Role.OWNER, Role.INSTRUCTOR);
    getUpdateCoursePassIt(Role.OWNER, "AUTHOR");
  });

  describe("DeleteCourse Authorization Middleware", () => {
    /**
     * Student
     *
     */
    getDeleteCourseThrowIt(
      Role.STUDENT,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseThrowIt(
      Role.STUDENT,
      Role.STUDENT,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseThrowIt(
      Role.STUDENT,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Instructor
     *
     */
    getDeleteCourseThrowIt(
      Role.INSTRUCTOR,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseThrowIt(
      Role.INSTRUCTOR,
      Role.STUDENT,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseThrowIt(
      Role.INSTRUCTOR,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCoursePassIt(Role.INSTRUCTOR, "AUTHOR");
    /**
     * Admin
     *
     */
    getDeleteCoursePassIt(Role.OWNER, null);
    getDeleteCoursePassIt(Role.OWNER, Role.STUDENT);
    getDeleteCoursePassIt(Role.OWNER, Role.INSTRUCTOR);
    getDeleteCoursePassIt(Role.OWNER, "AUTHOR");
  });

  describe("CreateCourseLike Authorization Middleware", () => {
    /**
     * Student
     *
     */
    getCreateCourseLikeThrowIt(
      Role.STUDENT,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCourseLikePassIt(Role.STUDENT, Role.STUDENT);
    getCreateCourseLikeThrowIt(
      Role.STUDENT,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Instructor
     *
     */
    getCreateCourseLikeThrowIt(
      Role.INSTRUCTOR,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCourseLikePassIt(Role.INSTRUCTOR, Role.STUDENT);
    getCreateCourseLikeThrowIt(
      Role.INSTRUCTOR,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCourseLikeThrowIt(
      Role.INSTRUCTOR,
      "AUTHOR",
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Admin
     *
     */
    getCreateCourseLikePassIt(Role.OWNER, null);
    getCreateCourseLikePassIt(Role.OWNER, Role.STUDENT);
    getCreateCourseLikePassIt(Role.OWNER, Role.INSTRUCTOR);
    getCreateCourseLikePassIt(Role.OWNER, "AUTHOR");
  });

  describe("CreateCourseLike Authorization Middleware", () => {
    /**
     * Student
     *
     */
    getCreateCourseLikeThrowIt(
      Role.STUDENT,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCourseLikePassIt(Role.STUDENT, Role.STUDENT);
    getCreateCourseLikeThrowIt(
      Role.STUDENT,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Instructor
     *
     */
    getCreateCourseLikeThrowIt(
      Role.INSTRUCTOR,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCourseLikePassIt(Role.INSTRUCTOR, Role.STUDENT);
    getCreateCourseLikeThrowIt(
      Role.INSTRUCTOR,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    getCreateCourseLikeThrowIt(
      Role.INSTRUCTOR,
      "AUTHOR",
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Admin
     *
     */
    getCreateCourseLikePassIt(Role.OWNER, null);
    getCreateCourseLikePassIt(Role.OWNER, Role.STUDENT);
    getCreateCourseLikePassIt(Role.OWNER, Role.INSTRUCTOR);
    getCreateCourseLikePassIt(Role.OWNER, "AUTHOR");
  });

  describe("DeleteCourseLike Authorization Middleware", () => {
    /**
     * Student
     *
     */
    getDeleteCourseLikeThrowIt(
      Role.STUDENT,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseLikePassIt(Role.STUDENT, Role.STUDENT);
    getDeleteCourseLikeThrowIt(
      Role.STUDENT,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Instructor
     *
     */
    getDeleteCourseLikeThrowIt(
      Role.INSTRUCTOR,
      null,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseLikePassIt(Role.INSTRUCTOR, Role.STUDENT);
    getDeleteCourseLikeThrowIt(
      Role.INSTRUCTOR,
      Role.INSTRUCTOR,
      AuthorizationException,
      "AuthorizationException"
    );
    getDeleteCourseLikeThrowIt(
      Role.INSTRUCTOR,
      "AUTHOR",
      AuthorizationException,
      "AuthorizationException"
    );
    /**
     * Admin
     *
     */
    getDeleteCourseLikePassIt(Role.OWNER, null);
    getDeleteCourseLikePassIt(Role.OWNER, Role.STUDENT);
    getDeleteCourseLikePassIt(Role.OWNER, Role.INSTRUCTOR);
    getDeleteCourseLikePassIt(Role.OWNER, "AUTHOR");
  });
});
