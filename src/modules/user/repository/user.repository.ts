import "reflect-metadata";
import { CreateUserDto, Me } from "../user.type";
import { inject, injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { User } from "@prisma/client";
import getValuable from "../../../common/functions/getValuable";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

export interface IUserRepository {
  createUser: (
    dto: CreateUserDto,
    accessToken: string,
    refreshToken: string[],
  ) => Promise<User>;
  getUserById: (userId: number) => Promise<User | null>;
  getUserByIdOrThrow: (userId: number, error?: Error) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<User | null>;
  getMe: (userId: number) => Promise<Me>;
  updateUser: (userId: number, dto: Partial<User>) => Promise<User>;
  updateUserPassword: (userId: number, password: string) => Promise<User>;
  deleteUser: (userId: number) => Promise<User>;
}

@injectable()
export class UserRepository implements IUserRepository {
  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly userTable = this.prisma.user;

  public async createUser(
    dto: CreateUserDto,
    accessToken: string,
    refreshToken: string[],
  ): Promise<User> {
    const newUser = await this.userTable.create({
      data: { ...dto, accessToken, refreshToken },
    });

    return newUser;
  }

  public async getUserById(userId: number): Promise<User | null> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.user.findUnique({ where: { id: userId } });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getUserByIdOrThrow(
    userId: number,
    error?: Error,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    if (!user) {
      throw error || new RecordNotFoundException();
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.user.findUnique({ where: { email } });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<User | null> {
    return await this.userTable.findFirst({
      where: {
        refreshToken: { has: refreshToken },
      },
    });
  }

  public async getMe(userId: number) {
    const { courseEnrollments, ...user } =
      await this.userTable.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          courseEnrollments: {
            select: {
              course: {
                select: {
                  id: true,
                  totalLessons: true,
                  createdAt: true,
                  updatedAt: true,
                  title: true,
                  description: true,
                  totalStudents: true,
                  totalLikes: true,
                },
              },
            },
          },
        },
      });
    const me = {
      ...getValuable(user),
      courses: courseEnrollments.map((enrollments) => {
        return enrollments.course;
      }),
    } satisfies Me;

    return me;
  }

  public async updateUser(userId: number, dto: Partial<User>): Promise<User> {
    return await this.prisma.$transaction(async (tx) => {
      await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId);

      return await tx.user.update({
        where: {
          id: userId,
        },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async updateUserPassword(
    userId: number,
    password: string,
  ): Promise<User> {
    const updatedUser = await this.userTable.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });

    return updatedUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    return await this.userTable.delete({
      where: {
        id: userId,
      },
    });
  }
}
