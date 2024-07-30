import "reflect-metadata";
import {
  $UserReturnData,
  CreateUserDto,
  UserDITypes,
  UserModel,
} from "../user.type";
import { inject, injectable } from "inversify";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { PrismaClient } from "@prisma/client";
import getPrismaDb from "../../../common/functions/getPrismaDb";
import asyncLocalStorage from "../../../common/asyncLocalStorage";
import { IUserAuthorization, IUserRepository } from "../user.interface";
import { PrismaTransaction } from "../../../common/types";

@injectable()
export default class UserRepository implements IUserRepository {
  private db: PrismaTransaction | PrismaClient;

  @inject(UserDITypes.AUTHORIZATION)
  private readonly authorization: IUserAuthorization;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  constructor() {
    this.wrapMethods();
  }

  public async createUser(
    dto: CreateUserDto,
    accessToken: string,
    refreshToken: string[],
  ): Promise<UserModel> {
    return this.db.user.create({
      data: { ...dto, accessToken, refreshToken },
    });
  }

  public async getUserById(userId: number): Promise<UserModel | null> {
    return this.db.user.findUnique({ where: { id: userId } });
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
    return this.db.user.findUnique({ where: { email } });
  }

  public async getUserByAccessToken(
    accessToken: string,
  ): Promise<UserModel | null> {
    return this.db.user.findFirst({
      where: {
        accessToken,
      },
    });
  }

  public async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserModel | null> {
    return this.db.user.findFirst({
      where: {
        refreshToken: {
          has: refreshToken,
        },
      },
    });
  }

  public async updateUser(
    userId: number,
    dto: Partial<UserModel>,
  ): Promise<UserModel> {
    return this.db.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  public async getUserAssignments(
    userId: number,
  ): Promise<$UserReturnData.GetUserAssignments> {
    const enrollments = await this.db.courseEnrollment.findMany({
      where: {
        id: userId,
      },
      select: {
        course: {
          select: {
            title: true,
            classes: {
              select: {
                assignments: {
                  include: {
                    courseClass: {
                      select: {
                        title: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const assignments: $UserReturnData.GetUserAssignments = [];
    for (let enrollment of enrollments) {
      for (const theClass of enrollment.course.classes) {
        for (const assignment of theClass.assignments) {
          const { courseClass: tempTheClass, ...theAssignment } = assignment;
          assignments.push({
            ...theAssignment,
            class: tempTheClass,
            course: { title: enrollment.course.title },
          });
        }
      }
    }

    assignments.sort((a, b) => b.id - a.id);

    return assignments;
  }

  public async deleteUser(userId: number): Promise<UserModel> {
    return this.db.user.delete({
      where: { id: userId },
    });
  }

  private wrapMethods() {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    ).filter(
      (name) =>
        name !== "constructor" && typeof (this as any)[name] === "function",
    );

    methodNames.forEach((methodName) => {
      const originalMethod = (this as any)[methodName];
      (this as any)[methodName] = (...args: any[]) => {
        this.db = getPrismaDb(asyncLocalStorage);
        return originalMethod.apply(this, args);
      };
    });
  }
}
