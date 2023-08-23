import { UserModel, UserDateKeys, SignUpDto, Me } from "../user.type";
import { injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { User } from "@prisma/client";
import getValuable from "../../../common/functions/getValuable";

export interface IUserRepository {
  getMe: (userId: number) => Promise<Me>;
  createNewUser: (
    userDetails: SignUpDto,
    accessToken: string,
    refreshToken: string
  ) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User | null>;
  updateExistingUserDetails: (
    userId: number,
    userDetails: Partial<UserModel>
  ) => Promise<User>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly userTable = this.prisma.user;

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

  public async getMe(userId: number): Promise<Me> {
    try {
      const user = await this.userTable.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      user.refreshToken = "secret";

      const courseEnrollments = await this.prisma.courseEnrollment.findMany({
        where: {
          userId,
        },
        select: {
          courseId: true,
        },
      });

      const courses = await this.prisma.course.findMany({
        where: {
          id: {
            in: courseEnrollments.map((enrollment) => enrollment.courseId),
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          totalStudents: true,
          totalLikes: true,
          totalLessons: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return {
        ...getValuable(user),
        courses,
      };
    } catch (error) {
      throw error;
    }
  }

  public async createNewUser(
    userDetails: SignUpDto,
    accessToken: string,
    refreshToken: string
  ): Promise<User> {
    try {
      const newUserDetails = await this.userTable.create({
        data: { ...userDetails, accessToken, refreshToken },
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
    userId: number,
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
      throw error;
    }
  }
}
