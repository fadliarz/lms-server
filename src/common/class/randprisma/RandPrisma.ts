import { faker } from "@faker-js/faker";
import PrismaClientSingleton from "../PrismaClientSingleton";
import RandDB from "./rand.type";
import getValuable from "../../functions/getValuable";
import { UserModel } from "../../../modules/user/user.type";
import {
  CourseEnrollmentModel,
  CourseLikeModel,
  CourseModel,
  CreateCourseDto,
} from "../../../modules/course/course.type";
import {
  CourseCategoryModel,
  CreateCourseCategoryDto,
} from "../../../modules/category/category.type";
import { Role } from "@prisma/client";
import {
  CourseLessonModel,
  CreateCourseLessonDto,
} from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoModel } from "../../../modules/video/video.type";

export default class RandPrisma implements RandDB {
  private readonly prisma = PrismaClientSingleton.getInstance();

  private generateRandomString(length: number) {
    return faker.string.alpha(length);
  }

  private generateRandomInteger(min: number, max: number) {
    return faker.number.int({ min, max });
  }

  private generateUserInputArg() {
    return {
      email: this.generateRandomString(8).concat("@gmail.com"),
      password: this.generateRandomString(8),
      name: this.generateRandomString(8),
      NIM: this.generateRandomInteger(1, 1000).toString(),
    };
  }

  private generateCategoryInputArg() {
    return {
      title: this.generateRandomString(8),
    };
  }

  private generateCourseLessonInputArg(courseId: number) {
    return {
      courseId,
      title: this.generateRandomString(8),
    };
  }

  private generateCourseLessonVideoInputArg(lessonId: number) {
    return {
      lessonId,
      name: this.generateRandomString(8),
      totalDurations: this.generateRandomInteger(1, 5),
      youtubeLink: "https://www.youtube.com/".concat(
        this.generateRandomString(8),
        "/"
      ),
    };
  }

  public async generateUser(userRole: Role): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: { ...this.generateUserInputArg(), role: userRole },
    });

    return getValuable(user);
  }

  public async generateCategory(): Promise<CourseCategoryModel> {
    const category = await this.prisma.courseCategory.create({
      data: this.generateCategoryInputArg(),
    });

    return getValuable(category);
  }

  public generateCreateCourseDto(categoryId: number): CreateCourseDto {
    return {
      title: this.generateRandomString(8),
      categoryId,
    };
  }

  public generateCreateCategoryDto(): CreateCourseCategoryDto {
    return {
      title: this.generateRandomString(8),
    };
  }

  public generateCreateLessonDto(): CreateCourseLessonDto {
    return {
      title: this.generateRandomString(8),
      description: this.generateRandomString(8),
    };
  }

  public async generateCourse(): Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
  }> {
    const user = await this.generateUser(Role.INSTRUCTOR);
    const category = await this.generateCategory();
    const course = await this.prisma.course.create({
      data: {
        ...this.generateCreateCourseDto(category.id),
        authorId: user.id,
      },
    });

    return {
      author: getValuable(user),
      category: getValuable(category),
      course: getValuable(course),
    };
  }

  public async generateLesson(): Promise<{
    author: UserModel;
    category: CourseCategoryModel;
    course: CourseModel;
    lesson: CourseLessonModel;
  }> {
    const user = await this.generateUser(Role.INSTRUCTOR);
    const category = await this.generateCategory();
    const course = await this.prisma.course.create({
      data: {
        ...this.generateCreateCourseDto(category.id),
        authorId: user.id,
      },
    });
    const lesson = await this.prisma.courseLesson.create({
      data: {
        ...this.generateCreateLessonDto(),
        courseId: course.id,
      },
    });

    return {
      author: getValuable(user),
      category: getValuable(category),
      course: getValuable(course),
      lesson: getValuable(lesson),
    };
  }

  public async insertManyLessonsIntoCourse(
    courseId: number,
    numberOfLessons: number
  ): Promise<CourseLessonModel[]> {
    let lessons: CourseLessonModel[] = [];
    for (let i = 0; i < numberOfLessons; i++) {
      const lesson = await this.prisma.courseLesson.create({
        data: this.generateCourseLessonInputArg(courseId),
      });

      lessons.push(getValuable(lesson));
    }

    return lessons;
  }

  public async insertManyVideosIntoLesson(
    lessonId: number,
    numberOfVideos: number
  ): Promise<CourseLessonVideoModel[]> {
    let videos: CourseLessonVideoModel[] = [];
    for (let i = 0; i < numberOfVideos; i++) {
      const video = await this.prisma.courseLessonVideo.create({
        data: this.generateCourseLessonVideoInputArg(lessonId),
      });

      videos.push(getValuable(video));
    }

    return videos;
  }

  public async insertOneEnrollmentIntoCourse(
    userId: number,
    courseId: number,
    enrollmentRole: Role
  ): Promise<CourseEnrollmentModel> {
    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        courseId,
        userId,
        role: enrollmentRole,
      },
    });

    return getValuable(enrollment);
  }

  public async insertOneLikeIntoCourse(
    userId: number,
    courseId: number
  ): Promise<CourseLikeModel> {
    const like = await this.prisma.$transaction(async (tx) => {
      const like = await this.prisma.courseLike.create({
        data: {
          userId,
          courseId,
        },
      });

      await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          totalLikes: {
            increment: 1,
          },
        },
      });

      return like;
    });

    return getValuable(like);
  }
}
