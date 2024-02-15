import RandDBUtil from "./RandDBUtil";
import {
  ICourseLessonRandDB,
  ICourseLessonVideoRandBD,
  PrismaRandDBDITypes,
} from "./rand.type";
import { UserModel } from "../../../modules/user/user.type";
import { CourseCategoryModel } from "../../../modules/category/category.type";
import {
  CourseModel,
  UserRoleModel,
} from "../../../modules/course/course.type";
import { CourseLessonModel } from "../../../modules/lesson/lesson.type";
import {
  CourseLessonVideoModel,
  CreateCourseLessonVideoDto,
} from "../../../modules/video/video.type";
import getValuable from "../../functions/getValuable";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { inject } from "inversify";

export default class PrismaCourseLessonVideoRandDB
  extends RandDBUtil
  implements ICourseLessonVideoRandBD
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(PrismaRandDBDITypes.COURSE_LESSON)
  private readonly courseLesson: ICourseLessonRandDB;

  public async generateOne(authorUserRole: UserRoleModel): Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel;
    video: CourseLessonVideoModel;
  }> {
    const resources = await this.courseLesson.generateOne(authorUserRole);
    const video = await this.prisma.courseLessonVideo.create({
      data: {
        ...this.generateDto(),
        lessonId: resources.lesson.id,
      },
    });

    await this.prisma.course.update({
      where: {
        id: resources.course.id,
      },
      data: {
        totalVideos: 1,
        totalDurations: video.totalDurations,
      },
    });
    resources.course.totalVideos = 1;
    resources.course.totalDurations = video.totalDurations;

    await this.prisma.courseLesson.update({
      where: { id: resources.lesson.id },
      data: { totalVideos: 1, totalDurations: video.totalDurations },
    });
    resources.lesson.totalVideos = 1;
    resources.lesson.totalDurations = video.totalDurations;

    return {
      ...resources,
      video: getValuable(video),
    };
  }

  private generateDto(): CreateCourseLessonVideoDto {
    return {
      name: this.generateRandomString(8),
      description: this.generateRandomString(8),
      youtubeLink: this.generateRandomString(32),
      totalDurations: this.generateRandomInteger(5, 10),
    };
  }
}
