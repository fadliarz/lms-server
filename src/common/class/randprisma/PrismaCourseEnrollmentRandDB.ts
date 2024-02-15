import "reflect-metadata";
import RandDBUtil from "./RandDBUtil";
import {
  ICourseEnrollmentRandDB,
  ICourseRandDB,
  IUserRandDB,
  PrismaRandDBDITypes,
} from "./rand.type";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
  UserRoleModel,
} from "../../../modules/course/course.type";
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";
import { UserModel } from "../../../modules/user/user.type";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { inject } from "inversify";
import { CourseCategoryModel } from "../../../modules/category/category.type";
import isEqualOrIncludeCourseEnrollmentRole from "../../functions/isEqualOrIncludeCourseEnrollmentRole";

export default class PrismaCourseEnrollmentRandDB
  extends RandDBUtil
  implements ICourseEnrollmentRandDB
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(PrismaRandDBDITypes.USER)
  private readonly user: IUserRandDB;

  @inject(PrismaRandDBDITypes.COURSE)
  private readonly course: ICourseRandDB;

  public async generateOne({
    authorUserRole,
    userRole,
    enrollmentRole,
  }: {
    authorUserRole: UserRoleModel;
    userRole: UserRoleModel;
    enrollmentRole: CourseEnrollmentRoleModel;
  }): Promise<{
    author: UserModel;
    enrolledUser: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    enrollment: CourseEnrollmentModel;
  }> {
    const { author, category, course } =
      await this.course.generateOne(authorUserRole);
    const user = await this.user.generateOne(userRole);
    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        role: enrollmentRole,
      },
    });

    const updatedCourse = await this.prisma.course.update({
      where: {
        id: course.id,
      },
      data: isEqualOrIncludeCourseEnrollmentRole(
        enrollmentRole,
        CourseEnrollmentRoleModel.STUDENT,
      )
        ? { totalStudents: 1 }
        : { totalInstructors: 1 },
    });

    return {
      author,
      enrolledUser: user,
      category,
      course: updatedCourse,
      enrollment,
    };
  }
}
