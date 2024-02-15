import "reflect-metadata";
import RandDBUtil from "./RandDBUtil";
import { ICourseCategoryRandDB } from "./rand.type";
import { injectable } from "inversify";
import {
  CourseCategoryModel,
  CreateCourseCategoryDto,
} from "../../../modules/category/category.type";
import getValuable from "../../functions/getValuable";
import PrismaClientSingleton from "../PrismaClientSingleton";

@injectable()
export default class PrismaCourseCategoryRandDB
  extends RandDBUtil
  implements ICourseCategoryRandDB
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  public async generateOne(): Promise<CourseCategoryModel> {
    const category = await this.prisma.courseCategory.create({
      data: this.generateDto(),
    });

    return category;
  }

  private generateDto(): CreateCourseCategoryDto {
    return {
      title: this.generateRandomString(8),
    };
  }
}
