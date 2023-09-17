import { UserModel, SignUpDto, Me } from "../user.type";
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

  public async createNewUser(
    userDetails: SignUpDto,
    accessToken: string,
    refreshToken: string
  ): Promise<User> {
    const newUserDetails = await this.userTable.create({
      data: { ...userDetails, accessToken, refreshToken },
    });

    return newUserDetails;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userTable.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  public async updateExistingUserDetails(
    userId: number,
    userDetailsUpdates: Partial<Omit<UserModel, "id">>
  ): Promise<User> {
    const updatedUserDetails = await this.userTable.update({
      where: {
        id: userId,
      },
      data: userDetailsUpdates,
    });

    return updatedUserDetails;
  }
}
