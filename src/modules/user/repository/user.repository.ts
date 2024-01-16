import { CreateUserDto, Me, UpdateUserDto } from "../user.type";
import { injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import { User } from "@prisma/client";
import getValuable from "../../../common/functions/getValuable";

export interface IUserRepository {
  createUser: (
    userDetails: CreateUserDto,
    accessToken: string,
    refreshToken: string
  ) => Promise<User>;
  getUserById: (userId: number) => Promise<User | null>;
  getUserByEmail: (email: string) => Promise<User | null>;
  getMe: (userId: number) => Promise<Me>;
  updateUser: (userId: number, userDetails: Partial<User>) => Promise<User>;
  updateUserPassword: (userId: number, password: string) => Promise<User>;
  deleteUser: (userId: number) => Promise<{}>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly userTable = this.prisma.user;

  public async createUser(
    userDetails: CreateUserDto,
    accessToken: string,
    refreshToken: string
  ): Promise<User> {
    const newUser = await this.userTable.create({
      data: { ...userDetails, accessToken, refreshToken },
    });

    return newUser;
  }

  public async getUserById(userId: number) {
    const user = await this.userTable.findUnique({ where: { id: userId } });

    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userTable.findUnique({
      where: {
        email,
      },
    });

    return user;
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

  public async updateUser(userId: number, userDetails: Partial<User>) {
    const updatedUser = await this.userTable.update({
      where: {
        id: userId,
      },
      data: userDetails,
    });

    return updatedUser;
  }

  public async updateUserPassword(
    userId: number,
    password: string
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

  public async deleteUser(userId: number) {
    await this.userTable.delete({
      where: {
        id: userId,
      },
    });

    return {};
  }
}
