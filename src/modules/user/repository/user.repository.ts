import "reflect-metadata";
import {
  CreateUserDto,
  IUserAuthorization,
  Me,
  UserDITypes,
  UserModel,
} from "../user.type";
import { inject, injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";

export interface IUserRepository {
  createUser: (
    dto: CreateUserDto,
    accessToken: string,
    refreshToken: string[],
  ) => Promise<UserModel>;
  getUserById: (userId: number) => Promise<UserModel | null>;
  getUserByIdOrThrow: (userId: number, error?: Error) => Promise<UserModel>;
  getUserByEmail: (email: string) => Promise<UserModel | null>;
  getUserByAccessToken: (accessToken: string) => Promise<UserModel | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<UserModel | null>;
  getMe: (userId: number, targetUserId: number) => Promise<Me>;
  updateUser: (
    userId: number,
    targetUserId: number,
    dto: Partial<UserModel>,
  ) => Promise<UserModel>;
  unauthorizedUpdateUser: (
    userId: number,
    dto: Partial<UserModel>,
  ) => Promise<UserModel>;
  deleteUser: (userId: number, targetUserId: number) => Promise<UserModel>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(UserDITypes.AUTHORIZATION)
  private readonly authorization: IUserAuthorization;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  public async createUser(
    dto: CreateUserDto,
    accessToken: string,
    refreshToken: string[],
  ): Promise<UserModel> {
    return await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { ...dto, accessToken, refreshToken },
      });

      return newUser;
    });
  }

  public async getUserById(userId: number): Promise<UserModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.user.findUnique({ where: { id: userId } });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getUserByIdOrThrow(
    userId: number,
    error?: Error,
  ): Promise<UserModel> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw error || new RecordNotFoundException();
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.user.findUnique({ where: { email } });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getUserByAccessToken(
    accessToken: string,
  ): Promise<UserModel | null> {
    return await this.prisma.user.findFirst({
      where: {
        accessToken,
      },
    });
  }

  public async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserModel | null> {
    return await this.prisma.user.findFirst({
      where: {
        refreshToken: {
          has: refreshToken,
        },
      },
    });
  }

  public async getMe(userId: number, targetUserId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeGetMe(user, targetUserId);

      const me = await tx.user.findUniqueOrThrow({
        where: { id: targetUserId },
      });

      return me;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async updateUser(
    userId: number,
    targetUserId: number,
    dto: Partial<UserModel>,
  ): Promise<UserModel> {
    return await this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeUpdateUser(user, targetUserId);

      return await tx.user.update({
        where: {
          id: targetUserId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async unauthorizedUpdateUser(
    userId: number,
    dto: Partial<UserModel>,
  ): Promise<UserModel> {
    return await this.prisma.$transaction(async (tx) => {
      return await tx.user.update({
        where: {
          id: userId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteUser(
    userId: number,
    targetUserId: number,
  ): Promise<UserModel> {
    return await this.prisma.$transaction(async (tx) => {
      const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
        tx,
        userId,
        new AuthenticationException(),
      );
      this.authorization.authorizeDeleteUser(user, targetUserId);

      return await tx.user.delete({
        where: {
          id: userId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }
}
