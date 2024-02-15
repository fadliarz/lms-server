import "reflect-metadata";
import RandDBUtil from "../randprisma/RandDBUtil";
import { CreateUserDto } from "../../../modules/user/user.type";
import { injectable } from "inversify";
import { IUserRandDTO } from "./rand_dto.type";

@injectable()
export default class UserRandDTO extends RandDBUtil implements IUserRandDTO {
  public generateCreateUserDTO(): CreateUserDto {
    return {
      name: this.generateRandomString(8),
      email: this.generateRandomString(8).concat(
        "@",
        this.generateRandomString(5),
        ".",
        this.generateRandomString(3),
      ),
      password: this.generateRandomString(8),
      NIM: this.generateRandomString(8),
      avatar: this.generateRandomString(16),
    };
  }
}
