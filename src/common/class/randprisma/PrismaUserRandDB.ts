import "reflect-metadata";
import { IUserRandDB } from "./rand.type";
import { injectable } from "inversify";
import { UserModel } from "../../../modules/user/user.type";
import PrismaClientSingleton from "../PrismaClientSingleton";
import RandDBUtil from "./RandDBUtil";
import { UserRoleModel } from "../../../modules/course/course.type";
import { faker } from "@faker-js/faker";

@injectable()
export default class PrismaUserRandDB
  extends RandDBUtil
  implements IUserRandDB
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  public async generateOne(userRole: UserRoleModel): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: {
        ...this.generateInputArg(),
        role: userRole,
        dateOfBirth: new Date(),
        address: faker.string.alpha(16),
        bloodType: faker.string.alpha(2).toUpperCase(),
        lineId: faker.string.alpha(10),
        emergencyNumber: faker.string.alpha(10),
      },
    });

    return user;
  }

  private generateInputArg() {
    return {
      email: this.generateRandomString(8).concat("@gmail.com"),
      password: this.generateRandomString(8),
      name: this.generateRandomString(8),
      NIM: this.generateRandomInteger(1, 1000).toString(),
    };
  }
}
