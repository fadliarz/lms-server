import "reflect-metadata";
import jwt from "jsonwebtoken";
import { isEqual } from "lodash";
import sha256Encrypt from "../../../utils/encrypt";
import {
  PrivilegeModel,
  PublicUserModel,
  UserDITypes,
  UserModel,
} from "../user.type";
import { $UserAPI } from "../user.api";

import { inject, injectable } from "inversify";
import validateEnv from "../../../common/functions/validateEnv";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import ClientException from "../../../common/class/exceptions/ClientException";
import { Request, Response } from "express";
import { Cookie } from "../../../common/constants/Cookie";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
import asyncLocalStorage from "../../../common/asyncLocalStorage";
import { LocalStorageKey } from "../../../common/constants/LocalStorageKey";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import {
  CourseEnrollmentRoleModel,
  UserRoleModel,
} from "../../course/course.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  IUserAuthorization,
  IUserRepository,
  IUserService,
} from "../user.interface";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import BaseService from "../../../common/class/BaseService";

@injectable()
export default class UserService extends BaseService implements IUserService {
  @inject(UserDITypes.REPOSITORY)
  private repository: IUserRepository;

  @inject(UserDITypes.AUTHORIZATION)
  private readonly authorization: IUserAuthorization;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createUser(dto: $UserAPI.CreateUser.Dto): Promise<
    {
      token: { accessToken: string; refreshToken: string };
    } & { user: $UserAPI.CreateUser.Response["data"] }
  > {
    try {
      dto.email = dto.email.toLowerCase();
      const { email, password } = dto;
      const accessToken = this.generateFreshAuthenticationToken(
        Cookie.ACCESS_TOKEN,
        email,
      );
      const refreshToken = this.generateFreshAuthenticationToken(
        Cookie.REFRESH_TOKEN,
        email,
      );
      dto.password = sha256Encrypt(password);

      const newUser = await this.repository.createUserAndBlankReport({
        ...dto,
        accessToken,
        refreshToken: [refreshToken],
      });

      return {
        user: this.getPublicUser(newUser),
        token: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error: any) {
      throw handleRepositoryError(error, {
        uniqueConstraint: {
          email: {
            message: "email is already taken!",
          },

          default: {
            message: "unique constraint failed!",
          },
        },
      });
    }
  }

  public async getPublicUsers(
    query: $UserAPI.GetPublicUsers.Query,
  ): Promise<$UserAPI.GetPublicUsers.Response["data"]> {
    try {
      return await this.repository.getPublicUsers(query);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserById(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserById.Response["data"]> {
    try {
      const targetUser = await this.repository.getUserById(id);

      if (!targetUser) {
        throw new RecordNotFoundException();
      }

      return await this.getPublicUser(targetUser);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getMe(user: UserModel): Promise<PublicUserModel> {
    return this.getPublicUser(user);
  }

  public async getUserPermissions(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserPermissions.Response["data"]> {
    try {
      this.authorization.authorizeGetUserPermissions(user, id.userId);

      return await this.repository.getUserPermissions(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserAssignments(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserAssignments.Response["data"]> {
    try {
      this.authorization.authorizeGetUserAssignments(user, id.userId);

      return await this.repository.getUserAssignments(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserEnrolledCourses(
    user: UserModel,
    id: {
      userId: number;
    },
    query: $UserAPI.GetUserEnrolledCourses.Query,
  ): Promise<$UserAPI.GetUserEnrolledCourses.Response["data"]> {
    try {
      this.authorization.authorizeGetUserEnrolledCourses(user, id.userId);

      return await this.repository.getUserEnrolledCourses(
        id,
        {
          role: [
            CourseEnrollmentRoleModel.STUDENT,
            CourseEnrollmentRoleModel.INSTRUCTOR,
          ],
        },
        query,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserManagedCourses(
    user: UserModel,
    id: {
      userId: number;
    },
    query: $UserAPI.GetUserManagedCourses.Query,
  ): Promise<$UserAPI.GetUserManagedCourses.Response["data"]> {
    try {
      await this.authorization.authorizeGetUserManagedCourses(user, id.userId);

      const isAcademicDivision =
        await this.repository.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.COURSE,
        );
      if (isAcademicDivision) {
        return await this.globalRepository.course.getCourses(query);
      }

      const targetUser = await this.repository.getUserByIdOrThrow(id);
      if (isEqualOrIncludeRole(targetUser.role, UserRoleModel.ADMIN)) {
        return await this.globalRepository.course.getCourses(query);
      }

      return await this.repository.getUserEnrolledCourses(
        id,
        {
          role: [CourseEnrollmentRoleModel.INSTRUCTOR],
        },
        query,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserCourseEnrollmentStatusByCourseId(
    user: UserModel,
    id: {
      userId: number;
      courseId: number;
    },
  ): Promise<
    $UserAPI.GetUserCourseEnrollmentStatusByCourseId.Response["data"]
  > {
    try {
      await this.authorization.authorizeGetUserCourseEnrollmentStatusByCourseId(
        user,
        id.userId,
      );

      return await this.repository.getUserCourseEnrollmentStatusByCourseId(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserEventAndCourseSchedules(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserEventAndCourseSchedules.Response["data"]> {
    try {
      this.authorization.authorizeGetUserEventAndCourseSchedules(
        user,
        id.userId,
      );

      return await this.repository.getUserEventAndCourseSchedules(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserEnrolledDepartmentPrograms(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserEnrolledDepartmentPrograms.Response["data"]> {
    try {
      await this.authorization.authorizeGetUserEnrolledDepartmentPrograms(
        user,
        id.userId,
      );

      return await this.repository.getUserEnrolledDepartmentPrograms(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserManagedDepartments(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserManagedDepartments.Response["data"]> {
    try {
      await this.authorization.authorizeGetUserManagedDepartments(
        user,
        id.userId,
      );

      const targetUser = await this.repository.getUserByIdOrThrow(id);
      if (isEqualOrIncludeRole(targetUser.role, UserRoleModel.ADMIN)) {
        return await this.globalRepository.department.getDepartments();
      }

      return await this.repository.getUserLedDepartments({
        userId: id.userId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserManagedDepartmentDivisions(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserManagedDepartmentDivisions.Response["data"]> {
    try {
      await this.authorization.authorizeGetUserManagedDepartmentDivisions(
        user,
        id.userId,
      );

      const targetUser = await this.repository.getUserByIdOrThrow(id);
      if (isEqualOrIncludeRole(targetUser.role, UserRoleModel.ADMIN)) {
        return await this.globalRepository.departmentDivision.getAllExtendedDivisions();
      }

      return await this.repository.getUserLedDepartmentDivisions({
        userId: id.userId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserReport(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserReport.Response["data"]> {
    try {
      await this.authorization.authorizeGetUserReport(user, id.userId);

      return await this.repository.getUserReportOrThrow({
        userId: id.userId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getUserOrders(
    user: UserModel,
    id: {
      userId: number;
    },
  ): Promise<$UserAPI.GetUserOrders.Response["data"]> {
    try {
      await this.authorization.authorizeGetUserOrders(user, id.userId);

      return await this.repository.getUserOrders({
        userId: id.userId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getDepartmentProgramsWithEnrollmentInformation(
    user: UserModel,
    id: {
      userId: number;
      departmentId: number;
    },
  ): Promise<
    $UserAPI.GetDepartmentProgramsWithEnrollmentInformation.Response["data"]
  > {
    try {
      await this.authorization.authorizeGetDepartmentProgramsWithEnrollmentInformation(
        user,
        id.userId,
      );

      return await this.repository.getDepartmentProgramsWithEnrollmentInformation(
        id,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateBasicUser(
    user: UserModel,
    id: {
      userId: number;
    },
    dto: $UserAPI.UpdateBasicUser.Dto,
  ): Promise<$UserAPI.UpdateBasicUser.Response["data"]> {
    try {
      this.authorization.authorizeUpdateUser(user, id.userId);

      return await this.repository.updateUser(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateUserEmail(
    user: UserModel,
    id: {
      userId: number;
    },
    data: {
      storedRefreshToken: string;
      dto: $UserAPI.UpdateUserEmail.Dto;
    },
  ): Promise<$UserAPI.UpdateUserEmail.Response["data"]> {
    try {
      const { dto, storedRefreshToken } = data;
      dto.email = dto.email.toLowerCase();

      this.authorization.authorizeUpdateUser(user, id.userId);

      return await this.repository.updateUser(id, {
        ...dto,
        refreshToken: [storedRefreshToken],
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateUserPassword(
    user: UserModel,
    id: { userId: number },
    data: {
      storedRefreshToken: string;
      dto: $UserAPI.UpdateUserPassword.Dto;
    },
  ): Promise<$UserAPI.UpdateUserPassword.Response["data"]> {
    try {
      this.authorization.authorizeUpdateUser(user, id.userId);

      return await this.repository.updateUser(id, {
        ...data.dto,
        refreshToken: [data.storedRefreshToken],
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateUserRole(
    user: UserModel,
    id: { userId: number },
    dto: $UserAPI.UpdateUserRole.Dto,
  ): Promise<$UserAPI.UpdateUserRole.Response["data"]> {
    try {
      this.authorization.authorizeUpdateUser(user, id.userId);

      const updatedUser = await this.repository.updateUser(
        { userId: id.userId },
        dto,
      );

      return this.getPublicUser(updatedUser);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteUser(
    user: UserModel,
    id: { userId: number },
  ): Promise<{ id: number }> {
    try {
      this.authorization.authorizeDeleteUser(user, id.userId);

      return await this.repository.deleteUser({ userId: id.userId });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  async signInUser(
    req: Request,
    res: Response,
    dto: { email: string; password: string },
  ): Promise<{}> {
    return this.prisma.$transaction(async (tx) => {
      dto.email = dto.email.toLowerCase();
      const { email, password } = dto;
      const userRelatedToSignInEmail = await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.getUserByEmail(email);
        },
      );
      if (!userRelatedToSignInEmail) {
        throw new RecordNotFoundException();
      }

      const isPasswordMatch = this.verifyPassword(
        password,
        userRelatedToSignInEmail.password,
      );
      if (!isPasswordMatch) {
        throw new ClientException("Invalid password!");
      }

      const cookies = req.cookies;
      const accessToken = this.generateFreshAuthenticationToken(
        Cookie.ACCESS_TOKEN,
        email,
      );
      const newRefreshToken = this.generateFreshAuthenticationToken(
        Cookie.REFRESH_TOKEN,
        email,
      );

      const storedRefreshToken = cookies[Cookie.REFRESH_TOKEN] as
        | string
        | undefined;

      let newRefreshTokenArray = userRelatedToSignInEmail.refreshToken;
      if (storedRefreshToken) {
        /**
         *
         * Some possible scenarios:
         *
         * 1. User logged in before but never uses refreshToken and doesn't sign out
         * 2. refreshToken is stolen
         *
         * If that's the case, then clear all refreshTokens when user signs in (reuse detection).
         *
         */

        const userBelongToStoredRefreshToken = await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return await this.repository.getUserByRefreshToken(
              storedRefreshToken,
            );
          },
        );
        if (!userBelongToStoredRefreshToken) {
          newRefreshTokenArray = [];
        } else {
          newRefreshTokenArray = newRefreshTokenArray.filter(
            (rt) => rt !== storedRefreshToken,
          );
        }

        res.clearCookie(Cookie.REFRESH_TOKEN, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      newRefreshTokenArray = [...newRefreshTokenArray, newRefreshToken];

      await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.updateUser(
            { userId: userRelatedToSignInEmail.id },
            {
              accessToken,
              refreshToken: newRefreshTokenArray,
            },
          );
        },
      );

      res
        .cookie(Cookie.ACCESS_TOKEN, accessToken, {
          httpOnly: false,
          maxAge: 1000 * 60 * 60 * Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
          secure: process.env.NODE_ENV === "production",
        })
        .cookie(Cookie.REFRESH_TOKEN, newRefreshToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

      return {};
    });
  }

  public async signOutUser(storedRefreshToken: string): Promise<{}> {
    return this.prisma.$transaction(async (tx) => {
      const userRelatedToStoredRefreshToken = await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.getUserByRefreshToken(
            storedRefreshToken,
          );
        },
      );

      if (!userRelatedToStoredRefreshToken) {
        throw new AuthenticationException();
      }

      await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.updateUser(
            { userId: userRelatedToStoredRefreshToken.id },
            {
              refreshToken:
                userRelatedToStoredRefreshToken?.refreshToken.filter(
                  (rt) => rt !== storedRefreshToken,
                ),
            },
          );
        },
      );

      return {};
    });
  }

  public generateFreshAuthenticationToken(
    type: Cookie.ACCESS_TOKEN | Cookie.REFRESH_TOKEN,
    email: string,
  ): string {
    const env = validateEnv();
    let privateKey = env.ACCESS_TOKEN_PRIVATE_KEY;
    let expiresIn =
      Math.floor(Date.now()) +
      1000 * 60 * 60 * Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR;
    if (type.toString() === Cookie.REFRESH_TOKEN.toString()) {
      privateKey = env.REFRESH_TOKEN_PRIVATE_KEY;
      expiresIn =
        Math.floor(Date.now()) +
        1000 * 60 * 60 * 24 * Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY;
    }

    return jwt.sign({ email }, privateKey as string, {
      expiresIn,
    });
  }

  private verifyPassword(password: string, encryptedPassword: string): boolean {
    return isEqual(sha256Encrypt(password), encryptedPassword);
  }

  private getPublicUser(user: UserModel): PublicUserModel {
    const { accessToken, refreshToken, password, ...publicUser } = user;

    return publicUser;
  }
}
