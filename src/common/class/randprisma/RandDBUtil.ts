import { faker } from "@faker-js/faker";
import { injectable } from "inversify";

@injectable()
export default abstract class RandDBUtil {
  public generateRandomString(length: number) {
    return faker.string.alpha(length);
  }

  public generateRandomInteger(min: number, max: number) {
    return faker.number.int({ min, max });
  }
}
