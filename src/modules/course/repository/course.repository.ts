import {
  CreateCourseDto,
  CreateCourseLikeIds,
  DeleteCourseLikeIds,
  Enroller,
  GetCourseQuery,
  GetCoursesQuery,
  UpdateCourseDto,
} from "../course.type";
import { Course, CourseCategory, CourseLesson, Role } from "@prisma/client";
import { injectable } from "inversify";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";
import processQuery from "../../../common/functions/processQuery";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import asyncForEach from "../../../common/functions/asyncForEach";

export interface ICourseRepository {
  getCategories: () => Promise<CourseCategory[]>;
  getAuthor: (courseId: number) => Promise<Enroller>;
  deleteLike: (
    likeId: number,
    ids: DeleteCourseLikeIds
  ) => Promise<Pick<Course, "totalLikes">>;
  createLike: (
    userId: number,
    ids: CreateCourseLikeIds
  ) => Promise<Pick<Course, "totalLikes">>;
  delete: (courseId: number) => Promise<Course>;
  update: (courseId: number, courseDetails: UpdateCourseDto) => Promise<Course>;
  getManyCourseEnrollers: (
    courseId: number,
    include: {
      students?: boolean;
      instructors?: boolean;
    }
  ) => Promise<{
    students?: Enroller[];
    instructors?: Enroller[];
  }>;
  getManyEnrolledCourses: (
    userId: number,
    role: Role | Role[],
    query: GetCoursesQuery
  ) => Promise<{ role: Role; course: Course & { category: CourseCategory } }[]>;
  getById: (
    courseId: number,
    query: GetCourseQuery
  ) => Promise<Course & { category: CourseCategory }>;
  getManyOwnedCourses: (
    userId: number,
    query: GetCoursesQuery
  ) => Promise<(Course & { category: CourseCategory })[]>;
  create: (userId: number, courseDetails: CreateCourseDto) => Promise<Course>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseTable = this.prisma.course;
  private readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  private readonly courseLikeTable = this.prisma.courseLike;
  private readonly courseCategoryTable = this.prisma.courseCategory;

  public async getCategories() {
    const categories = await this.courseCategoryTable.findMany();

    return categories;
  }

  public async getAuthor(courseId: number) {
    const { author } = await this.courseTable.findUniqueOrThrow({
      where: { id: courseId },
      select: {
        author: {
          select: {
            id: true,
            name: true,
            NIM: true,
            avatar: true,
          },
        },
      },
    });

    return author;
  }

  public async deleteLike(
    likeId: number,
    ids: DeleteCourseLikeIds
  ): Promise<Pick<Course, "totalLikes">> {
    const like = await this.prisma.$transaction(async (tx) => {
      const [updatedCourse] = await Promise.all([
        tx.course.update({
          where: {
            id: ids.courseId,
          },
          data: {
            totalLikes: { decrement: 1 },
          },
          select: {
            totalLikes: true,
          },
        }),
        tx.courseLike.delete({
          where: {
            id: likeId,
          },
          select: {
            id: true,
          },
        }),
      ]);

      return updatedCourse;
    });

    return like;
  }

  public async createLike(
    userId: number,
    ids: CreateCourseLikeIds
  ): Promise<Pick<Course, "totalLikes">> {
    const like = await this.prisma.$transaction(async (tx) => {
      const [updatedCourse] = await Promise.all([
        tx.course.update({
          where: {
            id: ids.courseId,
          },
          data: {
            totalLikes: { increment: 1 },
          },
          select: {
            totalLikes: true,
          },
        }),
        tx.courseLike.create({
          data: {
            courseId: ids.courseId,
            userId,
          },
          select: {
            id: true,
          },
        }),
      ]);

      return updatedCourse;
    });

    return like;
  }

  public async delete(courseId: number): Promise<Course> {
    const deletedCourse = await this.prisma.$transaction(async (tx) => {
      let myCursor = -1;
      let lesson: Pick<CourseLesson, "id">;
      const { id: maxLessonId } = await tx.courseLesson.findFirstOrThrow({
        where: {
          courseId,
        },
        orderBy: {
          id: "desc",
        },
        select: { id: true },
      });

      while (myCursor < maxLessonId) {
        const lessons = await tx.courseLesson.findMany({
          skip: myCursor === -1 ? 0 : 1,
          take: 1,
          cursor:
            myCursor === -1
              ? undefined
              : {
                  id: myCursor,
                },
          select: {
            id: true,
          },
        });

        lesson = lessons[0];
        myCursor = lesson.id;

        await tx.courseLessonVideo.deleteMany({
          where: {
            lessonId: lesson.id,
          },
        });
      }

      await Promise.all([
        tx.courseLesson.deleteMany({
          where: {
            courseId,
          },
        }),
        tx.courseEnrollment.deleteMany({
          where: {
            courseId,
          },
        }),
        tx.courseLike.deleteMany({
          where: {
            courseId,
          },
        }),
      ]);

      const deletedCourse = await tx.course.delete({
        where: {
          id: courseId,
        },
      });

      return deletedCourse;
    });

    return deletedCourse;
  }

  public async update(
    courseId: number,
    courseDetails: UpdateCourseDto
  ): Promise<Course> {
    const updatedCourse = await this.courseTable.update({
      where: { id: courseId },
      data: courseDetails,
    });

    return updatedCourse;
  }
  public async getManyCourseEnrollers(
    courseId: number,
    include: {
      students?: boolean;
      instructors?: boolean;
    }
  ): Promise<{
    students?: Enroller[];
    instructors?: Enroller[];
  }> {
    const enrollments = await this.courseEnrollmentTable.findMany({
      where: {
        courseId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            NIM: true,
            avatar: true,
          },
        },
        role: true,
      },
    });

    const students: Enroller[] = [];
    const instructors: Enroller[] = [];

    enrollments.forEach((enrollment) => {
      if (
        include.students &&
        isEqualOrIncludeRole(enrollment.role, Role.STUDENT)
      ) {
        students.push(enrollment.user);
      }

      if (
        include.instructors &&
        isEqualOrIncludeRole(enrollment.role, Role.INSTRUCTOR)
      ) {
        instructors.push(enrollment.user);
      }
    });

    let returnValue = {};

    if (include.students) {
      returnValue = { ...returnValue, students };
    }

    if (include.instructors) {
      returnValue = { ...returnValue, instructors };
    }

    return returnValue;
  }

  public async getById<R = Course & { category: CourseCategory }>(
    courseId: number,
    query: GetCourseQuery
  ): Promise<R> {
    const { include_author, include_lessons, include_videos } =
      processQuery(query);
    let course = (await this.courseTable.findUniqueOrThrow({
      where: {
        id: courseId,
      },
      include: {
        author: include_author
          ? {
              select: {
                id: true,
                name: true,
                NIM: true,
              },
            }
          : undefined,
        lessons: include_lessons
          ? {
              include: {
                videos: include_videos,
              },
            }
          : false,
        category: true,
      },
    })) as R;

    return course;
  }

  public async getManyEnrolledCourses(
    userId: number,
    role: Role | Role[],
    query: GetCoursesQuery
  ): Promise<{ role: Role; course: Course & { category: CourseCategory } }[]> {
    const courseEnrollments = await this.courseEnrollmentTable.findMany({
      where: {
        userId,
        role: {
          in: role,
        },
      },
      select: {
        courseId: true,
        role: true,
      },
    });

    let courses = [] as {
      role: Role;
      course: Course & { category: CourseCategory };
    }[];

    if (Array.isArray(role)) {
      await asyncForEach(role, async (theRole: Role) => {
        const courseId = courseEnrollments
          .filter((value) => {
            return isEqualOrIncludeRole(value.role, theRole);
          })
          .map((value) => value.courseId);

        const partialCourses = await this.courseTable.findMany({
          where: {
            id: {
              in: courseId,
            },
            categoryId: query.category_id
              ? parseInt(query.category_id)
              : undefined,
          },
          include: {
            category: true,
          },
        });

        courses.push(
          ...partialCourses.map((course) => {
            return { course, role: theRole };
          })
        );
      });
    } else {
      const theCourses = await this.courseTable.findMany({
        where: {
          id: {
            in: courseEnrollments.map((value) => value.courseId),
          },
          categoryId: query.category_id
            ? parseInt(query.category_id)
            : undefined,
        },
        include: {
          category: true,
        },
      });

      courses = theCourses.map((course) => {
        return { course: course, role };
      });
    }

    return courses;
  }

  public async getManyOwnedCourses<
    R = (Course & { category: CourseCategory })[]
  >(userId: number, query: GetCoursesQuery): Promise<R> {
    const courses = (await this.courseTable.findMany({
      where: {
        authorId: userId,
        categoryId: query.category_id ? parseInt(query.category_id) : undefined,
      },
      include: {
        category: true,
      },
    })) as R;

    return courses;
  }

  public async create(
    userId: number,
    courseDetails: CreateCourseDto
  ): Promise<Course> {
    const course = await this.courseTable.create({
      data: {
        ...courseDetails,

        authorId: userId,
      },
    });

    return course;
  }
}
