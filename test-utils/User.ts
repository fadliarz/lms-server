import {
  Course,
  CourseEnrollment,
  CourseLesson,
  CourseLessonVideo,
  Prisma,
  PrismaClient,
  Role,
} from "@prisma/client";
import { User } from "@prisma/client";
import isEqualOrIncludeRole from "../src/common/functions/isEqualOrIncludeRole";

export type TestObject = {
  user: User;
  course: Course;
  lesson: CourseLesson;
  video: CourseLessonVideo;
};

export default class UserForTest {
  public static readonly prisma = new PrismaClient();

  public static getGenerateTestObjectFunction(
    userRole: Role,
    enrollmentRole?: Exclude<Role, "OWNER">
  ) {
    return async (): Promise<TestObject> => {
      if (enrollmentRole) {
        const { user, ...enrollment } =
          await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
            where: {
              role: enrollmentRole,
              user: {
                role: userRole,
              },
            },
            include: {
              user: true,
            },
          });

        const { lessons, ...course } =
          await UserForTest.prisma.course.findUniqueOrThrow({
            where: {
              id: enrollment.courseId,
            },
            include: {
              lessons: {
                include: {
                  videos: {
                    take: 1,
                  },
                },
                take: 1,
              },
            },
          });
        const { videos, ...lesson } = lessons[0];
        const video = videos[0];

        return { user, course, lesson, video };
      }

      const user = await UserForTest.prisma.user.findFirstOrThrow({
        where: {
          role: userRole,
        },
      });

      const enrollment =
        await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
          where: {
            userId: {
              notIn: [user.id],
            },
            course: {
              authorId: {
                notIn: [user.id],
              },
            },
          },
        });

      const { lessons, ...course } =
        await UserForTest.prisma.course.findUniqueOrThrow({
          where: {
            id: enrollment.courseId,
          },
          include: {
            lessons: {
              include: {
                videos: {
                  take: 1,
                },
              },
              take: 1,
            },
          },
        });
      const { videos, ...lesson } = lessons[0];
      const video = videos[0];

      if (!enrollmentRole) {
        const enrollment = await UserForTest.prisma.courseEnrollment.findUnique(
          {
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: course.id,
              },
            },
          }
        );

        if (enrollment) {
          await UserForTest.prisma.courseEnrollment.delete({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: course.id,
              },
            },
          });
        }
      }

      return { user, course, lesson, video };
    };
  }

  public static getGenerateTestObjectFunctionForAuthor(userRole: Role) {
    return async (): Promise<TestObject> => {
      const user = await UserForTest.prisma.user.findFirstOrThrow({
        where: {
          role: userRole,
        },
      });
      const { lessons, ...course } =
        await UserForTest.prisma.course.findFirstOrThrow({
          where: {
            authorId: user.id,
          },
          include: {
            lessons: {
              include: {
                videos: {
                  take: 1,
                },
              },
              take: 1,
            },
          },
        });
      const { videos, ...lesson } = lessons[0];
      const video = videos[0];

      return { user, course, lesson, video };
    };
  }

  // public static async getEnrolledInstructorAsInstructorAndCourse(): Promise<
  //   [User, Course]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const enrollment =
  //     await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
  //       where: {
  //         userId: user.id,
  //         role: Role.INSTRUCTOR,
  //       },
  //     });
  //   const course = await UserForTest.prisma.course.findUniqueOrThrow({
  //     where: {
  //       id: enrollment.courseId,
  //     },
  //   });

  //   return [user, course];
  // }

  // public static async getEnrolledInstructorAsStudentAndCourse(): Promise<
  //   [User, Course]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const enrollment =
  //     await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
  //       where: {
  //         userId: user.id,
  //         role: Role.STUDENT,
  //       },
  //     });
  //   const course = await UserForTest.prisma.course.findUniqueOrThrow({
  //     where: {
  //       id: enrollment.courseId,
  //     },
  //   });

  //   return [user, course];
  // }

  // public static async getInstructorAsAuthorAndCourse(): Promise<
  //   [User, Course]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const course = await UserForTest.prisma.course.findFirstOrThrow({
  //     where: {
  //       authorId: user.id,
  //     },
  //   });

  //   return [user, course];
  // }

  // public static async getEnrolledInstructorAsStudentAndLesson(): Promise<
  //   [User, CourseLesson]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const enrollment =
  //     await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
  //       where: {
  //         userId: user.id,
  //         role: Role.STUDENT,
  //       },
  //     });
  //   const course = await UserForTest.prisma.course.findUniqueOrThrow({
  //     where: {
  //       id: enrollment.courseId,
  //     },
  //   });
  //   const lesson = await UserForTest.prisma.courseLesson.findFirstOrThrow({
  //     where: {
  //       courseId: course.id,
  //     },
  //   });

  //   return [user, lesson];
  // }

  // public static async getEnrolledInstructorAsInstructorAndLesson(): Promise<
  //   [User, CourseLesson]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const enrollment =
  //     await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
  //       where: {
  //         userId: user.id,
  //         role: Role.INSTRUCTOR,
  //       },
  //     });
  //   const course = await UserForTest.prisma.course.findUniqueOrThrow({
  //     where: {
  //       id: enrollment.courseId,
  //     },
  //   });
  //   const lesson = await UserForTest.prisma.courseLesson.findFirstOrThrow({
  //     where: {
  //       courseId: course.id,
  //     },
  //   });

  //   return [user, lesson];
  // }

  // public static async getInstructorAsAuthorAndLesson(): Promise<
  //   [User, CourseLesson]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const course = await UserForTest.prisma.course.findFirstOrThrow({
  //     where: {
  //       authorId: user.id,
  //     },
  //   });
  //   const lesson = await UserForTest.prisma.courseLesson.findFirstOrThrow({
  //     where: {
  //       courseId: course.id,
  //     },
  //   });

  //   return [user, lesson];
  // }

  // public static async getEnrolledInstructorAsStudentAndVideo(): Promise<
  //   [User, CourseLessonVideo]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const enrollment =
  //     await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
  //       where: {
  //         userId: user.id,
  //         role: Role.STUDENT,
  //       },
  //     });
  //   const course = await UserForTest.prisma.course.findUniqueOrThrow({
  //     where: {
  //       id: enrollment.courseId,
  //     },
  //   });
  //   const lesson = await UserForTest.prisma.courseLesson.findFirstOrThrow({
  //     where: {
  //       courseId: course.id,
  //     },
  //   });
  //   const video = await UserForTest.prisma.courseLessonVideo.findFirstOrThrow({
  //     where: {
  //       lessonId: lesson.id,
  //     },
  //   });

  //   return [user, video];
  // }

  // public static async getEnrolledInstructorAsInstructorAndVideo(): Promise<
  //   [User, CourseLessonVideo]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const enrollment =
  //     await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
  //       where: {
  //         userId: user.id,
  //         role: Role.INSTRUCTOR,
  //       },
  //     });
  //   const course = await UserForTest.prisma.course.findUniqueOrThrow({
  //     where: {
  //       id: enrollment.courseId,
  //     },
  //   });
  //   const lesson = await UserForTest.prisma.courseLesson.findFirstOrThrow({
  //     where: {
  //       courseId: course.id,
  //     },
  //   });
  //   const video = await UserForTest.prisma.courseLessonVideo.findFirstOrThrow({
  //     where: {
  //       lessonId: lesson.id,
  //     },
  //   });

  //   return [user, video];
  // }

  // public static async getInstructorAsAuthorAndVideo(): Promise<
  //   [User, CourseLessonVideo]
  // > {
  //   const user = await UserForTest.prisma.user.findFirstOrThrow({
  //     where: {
  //       role: Role.INSTRUCTOR,
  //     },
  //   });
  //   const course = await UserForTest.prisma.course.findFirstOrThrow({
  //     where: {
  //       authorId: user.id,
  //     },
  //   });
  //   const lesson = await UserForTest.prisma.courseLesson.findFirstOrThrow({
  //     where: {
  //       courseId: course.id,
  //     },
  //   });
  //   const video = await UserForTest.prisma.courseLessonVideo.findFirstOrThrow({
  //     where: {
  //       lessonId: lesson.id,
  //     },
  //   });

  //   return [user, video];
  // }
}
