import {
  Course,
  CourseEnrollment,
  CourseLesson,
  CourseLessonVideo,
  CourseLike,
  PrismaClient,
  Role,
} from "@prisma/client";
import { User } from "@prisma/client";
import isEqualOrIncludeRole from "../../src/common/functions/isEqualOrIncludeRole";

export type TestObject = {
  user: User;
  course: Course;
  lesson: CourseLesson;
  video: CourseLessonVideo;
  like: CourseLike;
  enrollment: CourseEnrollment | null;
};

export default class UserForTest {
  public static readonly prisma = new PrismaClient();

  public static async deleteEnrollmentIfExists(
    userId: number,
    courseId: number
  ) {
    const enrollment = await UserForTest.prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (enrollment) {
      await UserForTest.prisma.courseEnrollment.delete({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });

      if (isEqualOrIncludeRole(enrollment.role, Role.STUDENT)) {
        const like = await UserForTest.prisma.courseLike.findFirst({
          where: {
            userId: userId,
          },
        });

        if (like) {
          await UserForTest.prisma.courseLike.delete({
            where: {
              id: like.id,
            },
          });
        }
      }
    }
  }

  public static getGenerateTestObjectFunction(
    userRole: Role,
    enrollmentRole?: Exclude<Role, "OWNER">
  ) {
    return async (): Promise<TestObject> => {
      let courseEnrollment = "" as unknown as CourseEnrollment | null;
      try {
        const { user, course, ...enrollment } =
          await UserForTest.prisma.courseEnrollment.findFirstOrThrow({
            where: {
              role: enrollmentRole,
              user: {
                role: userRole,
              },
            },
            include: {
              user: true,
              course: true,
            },
          });

        courseEnrollment = enrollment;

        const { videos, ...lesson } =
          await UserForTest.prisma.courseLesson.findFirstOrThrow({
            where: {
              courseId: course.id,
            },
            include: {
              videos: true,
            },
          });

        const like = await UserForTest.prisma.courseLike.findFirstOrThrow({
          where:
            enrollmentRole && isEqualOrIncludeRole(enrollmentRole, Role.STUDENT)
              ? {
                  courseId: course.id,
                  userId: user.id,
                }
              : {
                  courseId: course.id,
                  userId: {
                    notIn: [user.id],
                  },
                },
        });

        if (!enrollmentRole) {
          await UserForTest.deleteEnrollmentIfExists(user.id, course.id);

          courseEnrollment = null;
        }

        return {
          user,
          course,
          lesson,
          video:
            videos.length === 0
              ? await UserForTest.prisma.courseLessonVideo.create({
                  data: {
                    lessonId: lesson.id,
                    name: "name",
                    totalDurations: 1,
                    youtubeLink: "youtubeLink",
                  },
                })
              : videos[0],
          like,
          enrollment: courseEnrollment,
        };
      } catch (error) {
        throw error;
      }
    };
  }

  public static getGenerateTestObjectFunctionForAuthor(userRole: Role) {
    return async (): Promise<TestObject> => {
      const {
        lesson: {
          course: { author, ...course },
          ...lesson
        },
        ...video
      } = await UserForTest.prisma.courseLessonVideo.findFirstOrThrow({
        where: {
          lesson: {
            course: {
              author: {
                role: userRole,
              },
            },
          },
        },
        include: {
          lesson: {
            include: {
              course: {
                include: {
                  author: true,
                },
              },
            },
          },
        },
      });

      const like = await UserForTest.prisma.courseLike.findFirstOrThrow({
        where: {
          courseId: course.id,
        },
      });

      return { user: author, course, lesson, video, like, enrollment: null };
    };
  }
}
