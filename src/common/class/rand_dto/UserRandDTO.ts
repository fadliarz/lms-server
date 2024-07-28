import "reflect-metadata";
import RandDBUtil from "../randprisma/RandDBUtil";
import { CreateUserDto } from "../../../modules/user/user.type";
import { injectable } from "inversify";
import { IUserRandDTO } from "./rand_dto.type";
import { faker } from "@faker-js/faker";

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
      dateOfBirth: new Date(),
      address: faker.string.alpha(16),
      bloodType: faker.string.alpha(2).toUpperCase(),
      medicalHistories: [this.generateRandomString(8)],
      HMM: [this.generateRandomString(8)],
      UKM: [this.generateRandomString(8)],
      hobbies: [this.generateRandomString(8)],
      lineId: faker.string.alpha(10),
      emergencyNumber: faker.string.alpha(10),
    };
  }
}
