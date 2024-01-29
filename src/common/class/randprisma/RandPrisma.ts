import { faker } from "@faker-js/faker";
import PrismaClientSingleton from "../PrismaClientSingleton";
import RandDB from "./rand.type";
import getValuable from "../../functions/getValuable";
import { UserModel } from "../../../modules/user/user.type";
import {
  CourseLikeModel,
  CourseModel,
  CreateCourseDto,
} from "../../../modules/course/course.type";
import {
  CourseCategoryModel,
  CreateCourseCategoryDto,
} from "../../../modules/category/category.type";
import { CourseEnrollmentRole, Role } from "@prisma/client";
import {
  CourseLessonModel,
  CreateCourseLessonDto,
} from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoModel } from "../../../modules/video/video.type";
import isEqualOrIncludeCourseEnrollmentRole from "../../functions/isEqualOrIncludeCourseEnrollmentRole";
import { CourseEnrollmentModel } from "../../../modules/enrollment/enrollment.type";

export default class RandPrisma implements RandDB {
  private readonly prisma = PrismaClientSingleton.getInstance();

  /**
   *
   *
   * Generate Row
   *
   *
   */

  public async generateUser(userRole: Role): Promise<UserModel> {
    const user = await this.prisma.user.create({
      data: { ...this.generateUserInputArg(), role: userRole },
    });

    return getValuable(user);
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

  public async generateCategory(): Promise<CourseCategoryModel> {
    const category = await this.prisma.courseCategory.create({
      data: this.generateCategoryInputArg(),
    });

    return getValuable(category);
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

  /**
   *
   *
   * Generate Dto
   *
   *
   */

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

  /**
   *
   * @param courseId
   * @param numberOfLessons
   * @returns
   *
   * Update on Course [totalLessons]
   */
  public async insertManyLessonsIntoCourse(
    courseId: number,
    numberOfLessons: number,
  ): Promise<CourseLessonModel[]> {
    let lessons: CourseLessonModel[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (let i = 0; i < numberOfLessons; i++) {
        const lesson = await tx.courseLesson.create({
          data: this.generateCourseLessonInputArg(courseId),
        });

        lessons.push(getValuable(lesson));
      }

      await tx.course.update({
        where: {
          id: courseId,
        },
        data: {
          totalLessons: {
            increment: numberOfLessons,
          },
        },
      });
    });

    return lessons;
  }

  /**
   *
   * @param lessonId
   * @param numberOfVideos
   * @param durationEachVideo
   * @returns
   *
   * Update on Course [totalVideos, totalDurations]
   * Update on CourseLesson [totalVideos, totalDurations]
   *
   */
  public async insertManyVideosIntoLesson(
    lessonId: number,
    numberOfVideos: number,
    durationEachVideo: number,
  ): Promise<CourseLessonVideoModel[]> {
    let videos: CourseLessonVideoModel[] = [];
    await this.prisma.$transaction(async (tx) => {
      for (let i = 0; i < numberOfVideos; i++) {
        const video = await this.prisma.courseLessonVideo.create({
          data: this.generateCourseLessonVideoInputArg(
            lessonId,
            durationEachVideo,
          ),
        });

        videos.push(getValuable(video));
      }

      const totalDurationIncrement = numberOfVideos * durationEachVideo;
      const { courseId } = await tx.courseLesson.findUniqueOrThrow({
        where: {
          id: lessonId,
        },
        select: {
          courseId: true,
        },
      });
      await Promise.all([
        tx.courseLesson.update({
          where: {
            id: lessonId,
          },
          data: {
            totalVideos: {
              increment: numberOfVideos,
            },
            totalDurations: {
              increment: totalDurationIncrement,
            },
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalVideos: {
              increment: numberOfVideos,
            },
            totalDurations: {
              increment: totalDurationIncrement,
            },
          },
        }),
      ]);
    });

    return videos;
  }

  /**
   *
   * @param userId
   * @param courseId
   * @param enrollmentRole
   * @returns
   *
   * Update on Course [totalStudents/totalInstructors]
   *
   */
  public async insertOneEnrollmentIntoCourse(
    userId: number,
    courseId: number,
    enrollmentRole: CourseEnrollmentRole,
  ): Promise<CourseEnrollmentModel> {
    const enrollment = await this.prisma.$transaction(async (tx) => {
      const enrollment = await tx.courseEnrollment.create({
        data: {
          courseId,
          userId,
          role: enrollmentRole,
        },
      });

      if (isEqualOrIncludeCourseEnrollmentRole(enrollmentRole, Role.STUDENT)) {
        await tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalStudents: {
              increment: 1,
            },
          },
        });
      }

      if (
        isEqualOrIncludeCourseEnrollmentRole(enrollmentRole, Role.INSTRUCTOR)
      ) {
        await tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalInstructors: {
              increment: 1,
            },
          },
        });
      }

      return enrollment;
    });

    return getValuable(enrollment);
  }

  public async insertOneLikeIntoCourse(
    userId: number,
    courseId: number,
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

  /**
   *
   *
   * Private Method
   *
   *
   */

  private generateRandomString(length: number) {
    return faker.string.alpha(length);
  }

  private generateRandomInteger(min: number, max: number) {
    return faker.number.int({ min, max });
  }

  /**
   *
   *
   * Insert
   *
   *
   */

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

  private generateCourseLessonVideoInputArg(
    lessonId: number,
    duration: number,
  ) {
    return {
      lessonId,
      name: this.generateRandomString(8),
      totalDurations: duration,
      youtubeLink: "https://www.youtube.com/".concat(
        this.generateRandomString(8),
        "/",
      ),
    };
  }
}
