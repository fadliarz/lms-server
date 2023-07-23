import { UserModel, UserDateKeys } from "../user.type";
import { injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient, User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";

export interface IUserRepository {
  createNewUser: (
    userDetails: Omit<UserModel, UserDateKeys | "id" | "role">
  ) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User | null>;
  updateExistingUserDetails: (
    userId: string,
    userDetails: Partial<UserModel>
  ) => Promise<User>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private userTable = new PrismaClient().user;

  private async getFirstUserByFilter(
    filter: Partial<UserModel>
  ): Promise<User | null> {
    try {
      const user = await this.userTable.findFirst({ where: filter });

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async createNewUser(
    userDetails: Omit<UserModel, "id" | UserDateKeys | "role">
  ): Promise<User> {
    try {
      const newUserDetails = await this.userTable.create({
        data: { ...userDetails, id: uuidv4() },
      });

      return newUserDetails;
    } catch (error) {
      throw error;
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userTable.findUnique({
        where: {
          email,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  public async updateExistingUserDetails(
    userId: string,
    userDetailsUpdates: Partial<Omit<UserModel, "id">>
  ): Promise<User> {
    try {
      const updatedUserDetails = await this.userTable.update({
        where: {
          id: userId,
        },
        data: userDetailsUpdates,
      });

      return updatedUserDetails;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2015") {
          throw new HttpException(StatusCode.BAD_REQUEST, "User not found");
        }
      }

      throw error;
    }
  }
}
