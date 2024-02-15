import "reflect-metadata";
import RandDBUtil from "./RandDBUtil";
import {
  ICourseLessonRandDB,
  ICourseRandDB,
  PrismaRandDBDITypes,
} from "./rand.type";
import {
  CourseLessonModel,
  CreateCourseLessonDto,
} from "../../../modules/lesson/lesson.type";
import { UserModel } from "../../../modules/user/user.type";
import { CourseCategoryModel } from "../../../modules/category/category.type";
import {
  CourseModel,
  UserRoleModel,
} from "../../../modules/course/course.type";
import getValuable from "../../functions/getValuable";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { inject } from "inversify";

export default class PrismaCourseLessonRandDB
  extends RandDBUtil
  implements ICourseLessonRandDB
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(PrismaRandDBDITypes.COURSE)
  private readonly course: ICourseRandDB;

  public async generateOne(authorUserRole: UserRoleModel): Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel;
  }> {
    const resources = await this.course.generateOne(authorUserRole);
    const lesson = await this.prisma.courseLesson.create({
      data: {
        ...this.generateDto(),
        courseId: resources.course.id,
      },
    });
    await this.prisma.course.update({
      where: {
        id: resources.course.id,
      },
      data: {
        totalLessons: 1,
      },
    });
    resources.course.totalLessons = 1;

    return {
      ...resources,
      lesson: getValuable(lesson),
    };
  }

  private generateDto(): CreateCourseLessonDto {
    return {
      title: this.generateRandomString(8),
      description: this.generateRandomString(8),
    };
  }
}
