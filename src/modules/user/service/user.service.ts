import "reflect-metadata";
import jwt from "jsonwebtoken";
import { isEqual } from "lodash";
import sha256Encrypt from "../../../utils/encrypt";
import {
  $UserReturnData,
  CreateUserDto,
  PublicUserModel,
  UpdateBasicUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserPhoneNumberDto,
  UpdateUserRoleDto,
  UserDITypes,
  UserModel,
} from "../user.type";
import { inject, injectable } from "inversify";
import validateEnv from "../../../common/functions/validateEnv";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import ClientException from "../../../common/class/exceptions/ClientException";
import { Request, Response } from "express";
import { Cookie } from "../../../common/constants/Cookie";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import asyncLocalStorage from "../../../common/asyncLocalStorage";
import { LocalStorageKey } from "../../../common/constants/LocalStorageKey";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import {
  CourseEnrollmentRoleModel,
  UserRoleModel,
} from "../../course/course.type";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import {
  IUserAuthorization,
  IUserRepository,
  IUserService,
} from "../user.interface";

@injectable()
export default class UserService implements IUserService {
  @inject(UserDITypes.REPOSITORY)
  private repository: IUserRepository;

  @inject(UserDITypes.AUTHORIZATION)
  private readonly authorization: IUserAuthorization;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();

  public async createUser(dto: CreateUserDto): Promise<UserModel> {
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

      return await this.repository.createUser(dto, accessToken, [refreshToken]);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        uniqueConstraint: {
          email: {
            message: "email is already taken!",
          },
          nim: {
            message: "NIM is already taken!",
          },
          default: {
            message: "unique constraint failed!",
          },
        },
      });
    }
  }

  public async getPublicUserById(userId: number): Promise<PublicUserModel> {
    const user = await this.repository.getUserById(userId);

    if (!user) {
      throw new RecordNotFoundException();
    }

    return {
      id: user.id,
      name: user.name,
      NIM: user.NIM,
      avatar: user.avatar,
      about: user.about,
      role: user.role,
    };
  }

  public async getMe(userId: number): Promise<UserModel> {
    const me = await this.repository.getUserByIdOrThrow(userId);

    me.accessToken = null;
    me.refreshToken = [];

    return me;
  }

  public async getUserAssignments(
    userId: number,
    targetUserId: number,
  ): Promise<$UserReturnData.GetUserAssignments> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeGetUserAssignments(user, targetUserId);

      return await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return this.repository.getUserAssignments(userId);
        },
      );
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateBasicUser(
    userId: number,
    targetUserId: number,
    dto: UpdateBasicUserDto,
  ): Promise<UserModel> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeUpdateUser(user, targetUserId);

      return await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return this.repository.updateUser(targetUserId, dto);
        },
      );
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async updateUserEmail(
    userId: number,
    targetUserId: number,
    storedRefreshToken: string,
    dto: UpdateUserEmailDto,
  ): Promise<UserModel> {
    try {
      return this.prisma.$transaction(async (tx) => {
        dto.email = dto.email.toLowerCase();
        const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          userId,
          new AuthenticationException(),
        );
        this.authorization.authorizeUpdateUser(user, targetUserId);

        return await asyncLocalStorage.run(
          { [LocalStorageKey.TRANSACTION]: tx },
          async () => {
            return await this.repository.updateUser(targetUserId, {
              ...dto,
              refreshToken: [storedRefreshToken],
            });
          },
        );
      }, PrismaDefaultTransactionConfigForWrite);
    } catch (error: any) {
      throw handleRepositoryError(error, {
        uniqueConstraint: {
          default: {
            message: "email is already taken!",
          },
        },
      });
    }
  }

  public async updateUserPassword(
    userId: number,
    targetUserId: number,
    storedRefreshToken: string,
    dto: UpdateUserPasswordDto,
  ): Promise<UserModel> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeUpdateUser(user, targetUserId);

      return await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.updateUser(targetUserId, {
            ...dto,
            refreshToken: [storedRefreshToken],
          });
        },
      );
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async updateUserPhoneNumber(
    userId: number,
    targetUserId: number,
    dto: UpdateUserPhoneNumberDto,
  ): Promise<UserModel> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeUpdateUser(user, targetUserId);

      return await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.updateUser(targetUserId, dto);
        },
      );
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async updateUserRole(
    userId: number,
    targetUserId: number,
    dto: UpdateUserRoleDto,
  ): Promise<UserModel> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeUpdateUser(user, targetUserId);

      const targetUser =
        await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
          tx,
          targetUserId,
          new RecordNotFoundException(),
        );

      const currentRole = targetUser.role;
      const { role: newRole } = dto;
      if (isEqualOrIncludeRole(currentRole, newRole)) {
        return targetUser;
      }

      const { isStudent, isInstructor, isAdmin } = getRoleStatus(currentRole);

      if (
        (isStudent || isInstructor) &&
        isEqualOrIncludeRole(newRole, UserRoleModel.STUDENT)
      ) {
        await tx.courseEnrollment.updateMany({
          where: {
            userId: targetUserId,
          },
          data: {
            role: CourseEnrollmentRoleModel.INSTRUCTOR,
          },
        });

        await tx.course.deleteMany({
          where: {
            authorId: targetUserId,
          },
        });
      }

      return await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.updateUser(targetUserId, dto);
        },
      );
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteUser(userId: number, targetUserId: number): Promise<{}> {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeDeleteUser(user, targetUserId);

      await asyncLocalStorage.run(
        { [LocalStorageKey.TRANSACTION]: tx },
        async () => {
          return await this.repository.deleteUser(targetUserId);
        },
      );

      return {};
    }, PrismaDefaultTransactionConfigForWrite);
  }

  async signInUser(
    req: Request,
    res: Response,
    dto: { email: string; password: string },
  ): Promise<UserModel> {
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
          return await this.repository.updateUser(userRelatedToSignInEmail.id, {
            accessToken,
            refreshToken: newRefreshTokenArray,
          });
        },
      );

      const user = {
        ...userRelatedToSignInEmail,
        accessToken,
        newRefreshTokenArray,
      };

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

      return user;
    });
  }

  public async signOutUser(storedRefreshToken: string): Promise<void> {
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
            userRelatedToStoredRefreshToken.id,
            {
              refreshToken:
                userRelatedToStoredRefreshToken?.refreshToken.filter(
                  (rt) => rt !== storedRefreshToken,
                ),
            },
          );
        },
      );
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
}
