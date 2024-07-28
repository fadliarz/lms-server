import "reflect-metadata";
import RandDBUtil from "./RandDBUtil";
import {
  ICourseCategoryRandDB,
  ICourseRandDB,
  IUserRandDB,
  PrismaRandDBDITypes,
} from "./rand.type";
import { UserModel } from "../../../modules/user/user.type";
import { CourseCategoryModel } from "../../../modules/category/category.type";
import {
  CourseModel,
  CreateCourseDto,
  UserRoleModel,
} from "../../../modules/course/course.type";
import { inject, injectable } from "inversify";
import PrismaClientSingleton from "../PrismaClientSingleton";

@injectable()
export default class PrismaCourseRandDB
  extends RandDBUtil
  implements ICourseRandDB
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(PrismaRandDBDITypes.USER)
  private readonly user: IUserRandDB;

  @inject(PrismaRandDBDITypes.COURSE_CATEGORY)
  private readonly courseCategory: ICourseCategoryRandDB;

  public async generateOne(authorUserRole: UserRoleModel): Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
  }> {
    const user = await this.user.generateOne(authorUserRole);
    const category = await this.courseCategory.generateOne();
    const course = await this.prisma.course.create({
      data: {
        ...this.generateDto(category.id),
        authorId: user.id,
      },
    });

    return {
      author: user,
      category: category,
      course: course,
    };
  }

  private generateDto(categoryId: number): CreateCourseDto {
    return {
      code: this.generateRandomString(10),
      title: this.generateRandomString(8),
      categoryId,
    };
  }
}
