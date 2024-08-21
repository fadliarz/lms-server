import { $UserAPI, PrivilegeModel, UserModel } from "./user.type";
import { NextFunction, Request, Response } from "express";
import { Cookie } from "../../common/constants/Cookie";
import { CourseEnrollmentRoleModel, CourseModel } from "../course/course.type";

export interface IUserAuthorization {
  /**
   * Get
   *
   */

  authorizeGetUserAssignments: (user: UserModel, targetUserId: number) => void;
  authorizeGetUserEnrolledAsStudentCourses: (
    user: UserModel,
    targetUserId: number,
  ) => void;
  authorizeGetUserManagedCourses: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
  authorizeGetUserEventAndCourseSchedules: (
    user: UserModel,
    targetUserId: number,
  ) => void;
  authorizeGetUserEnrolledDepartmentPrograms: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
  authorizeGetUserManagedDepartments: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
  authorizeGetUserManagedDepartmentDivisions: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;
  authorizeGetUserReport: (
    user: UserModel,
    targetUserId: number,
  ) => Promise<void>;

  /**
   * Update
   *
   */
  authorizeUpdateUser: (user: UserModel, targetUserId: number) => void;
  authorizeDeleteUser: (user: UserModel, targetUserId: number) => void;
}

export interface IUserController {
  createUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getMe: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  /**
   * Get
   *
   */

  getUserAssignments: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserEnrolledAsStudentCourses: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserManagedCourses: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserEventAndCourseSchedules: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserEnrolledDepartmentPrograms: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserManagedDepartments: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserManagedDepartmentDivisions: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserReport: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;

  /**
   * Update
   *
   */

  updateBasicUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserEmail: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserRole: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserPhoneNumber: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  signIn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  signOut: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IUserService {
  /**
   * Create
   *
   */

  createUser: (dto: $UserAPI.CreateUser.Dto) => Promise<
    { user: $UserAPI.CreateUser.Response["data"] } & {
      token: {
        accessToken: string;
        refreshToken: string;
      };
    }
  >;

  /**
   * Get
   *
   *
   */

  getUserById: (id: {
    userId: number;
  }) => Promise<$UserAPI.GetUserById.Response["data"]>;
  getMe: (user: UserModel) => Promise<$UserAPI.GetMe.Response["data"]>;

  /**
   * Get User
   *
   */

  getUserAssignments: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserAssignments.Response["data"]>;
  getUserEnrolledAsStudentCourses: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserEnrolledAsStudentCourses.Response["data"]>;
  getUserManagedCourses: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserManagedCourses.Response["data"]>;
  getUserManagedDepartments: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserManagedDepartments.Response["data"]>;
  getUserManagedDepartmentDivisions: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserManagedDepartmentDivisions.Response["data"]>;
  getUserEventAndCourseSchedules: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserEventAndCourseSchedules.Response["data"]>;
  getUserEnrolledDepartmentPrograms: (
    user: UserModel,
    id: {
      userId: number;
    },
  ) => Promise<$UserAPI.GetUserEnrolledDepartmentPrograms.Response["data"]>;
  getUserReport: (
    user: UserModel,
    id: { userId: number },
  ) => Promise<$UserAPI.GetUserReport.Response["data"]>;

  /**
   * Update
   *
   */

  updateBasicUser: (
    user: UserModel,
    id: {
      userId: number;
    },
    dto: $UserAPI.UpdateBasicUser.Dto,
  ) => Promise<$UserAPI.UpdateBasicUser.Response["data"]>;
  updateUserEmail: (
    user: UserModel,
    id: {
      userId: number;
    },
    data: {
      storedRefreshToken: string;
      dto: $UserAPI.UpdateUserEmail.Dto;
    },
  ) => Promise<$UserAPI.UpdateUserEmail.Response["data"]>;
  updateUserPassword: (
    user: UserModel,
    id: { userId: number },
    data: {
      storedRefreshToken: string;
      dto: $UserAPI.UpdateUserPassword.Dto;
    },
  ) => Promise<$UserAPI.UpdateUserPassword.Response["data"]>;
  updateUserRole: (
    user: UserModel,
    id: { userId: number },
    dto: $UserAPI.UpdateUserRole.Dto,
  ) => Promise<$UserAPI.UpdateUserRole.Response["data"]>;
  updateUserPhoneNumber: (
    user: UserModel,
    id: { userId: number },
    dto: $UserAPI.UpdateUserPhoneNumber.Dto,
  ) => Promise<$UserAPI.UpdateUserPhoneNumber.Response["data"]>;

  /**
   * Delete
   *
   */
  deleteUser: (
    user: UserModel,
    id: { userId: number },
  ) => Promise<$UserAPI.DeleteUser.Response["data"]>;
  signInUser: (
    req: Request,
    res: Response,
    dto: {
      email: string;
      password: string;
    },
  ) => Promise<$UserAPI.SignIn.Response["data"]>;
  signOutUser: (
    storedRefreshToken: string,
  ) => Promise<$UserAPI.SignOut.Response["data"]>;
  generateFreshAuthenticationToken: (
    type: Cookie.ACCESS_TOKEN | Cookie.REFRESH_TOKEN,
    email: string,
  ) => string;
}

export interface IUserRepository {
  /**
   * Create
   *
   */
  createUser: (
    data: {
      accessToken: string;
      refreshToken: string[];
    } & $UserAPI.CreateUser.Dto,
  ) => Promise<UserModel>;
  createUserAndBlankReport: (
    data: {
      accessToken: string;
      refreshToken: string[];
    } & $UserAPI.CreateUser.Dto,
  ) => Promise<UserModel>;

  /**
   * Get
   *
   */

  getUserById: (id: { userId: number }) => Promise<UserModel | null>;
  getUserByIdOrThrow: (
    id: { userId: number },
    error?: Error,
  ) => Promise<UserModel>;
  getUserByEmail: (email: string) => Promise<UserModel | null>;
  getUserByAccessToken: (accessToken: string) => Promise<UserModel | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<UserModel | null>;

  /**
   * Get User
   *
   */

  getUserAssignments: (id: {
    userId: number;
  }) => Promise<$UserAPI.GetUserAssignments.Response["data"]>;
  getUserEnrolledCourses: (
    id: {
      userId: number;
    },
    where: {
      role: CourseEnrollmentRoleModel;
    },
  ) => Promise<CourseModel[]>;
  getUserEventAndCourseSchedules: (id: {
    userId: number;
  }) => Promise<$UserAPI.GetUserEventAndCourseSchedules.Response["data"]>;
  getUserEnrolledDepartmentPrograms: (id: {
    userId: number;
  }) => Promise<$UserAPI.GetUserEnrolledDepartmentPrograms.Response["data"]>;
  getUserLedDepartments: (id: {
    userId: number;
  }) => Promise<$UserAPI.GetUserManagedDepartments.Response["data"]>;
  getUserLedDepartmentDivisions: (id: {
    userId: number;
  }) => Promise<$UserAPI.GetUserManagedDepartmentDivisions.Response["data"]>;
  getUserReportOrThrow: (
    id: {
      userId: number;
    },
    error?: Error,
  ) => Promise<$UserAPI.GetUserReport.Response["data"]>;

  /**
   * Others
   */

  getUserAuthorizationStatusFromPrivilege: (
    id: { userId: number },
    privilege: PrivilegeModel,
  ) => Promise<boolean>;

  /**
   * Update
   *
   */

  updateUser: (
    id: { userId: number },
    data: Partial<UserModel>,
  ) => Promise<UserModel>;

  /**
   * Delete
   *
   */

  deleteUser: (id: { userId: number }) => Promise<UserModel>;
}
