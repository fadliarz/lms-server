import "reflect-metadata";
import { IUserRandDB } from "./rand.type";
import { injectable } from "inversify";
import { Role } from "@prisma/client";
import { UserModel } from "../../../modules/user/user.type";
import getValuable from "../../functions/getValuable";
import PrismaClientSingleton from "../PrismaClientSingleton";
import RandDBUtil from "./RandDBUtil";

@injectable()
export default class PrismaUserRandDB
  extends RandDBUtil
  implements IUserRandDB
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  public async generateOne(userRole: Role): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: { ...this.generateInputArg(), role: userRole },
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
