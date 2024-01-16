import {
  BasicCourseModel,
  BasicUser,
  CourseLikeModel,
  CourseLikeResourceId,
  CreateCourseDto,
  EnrolledCourseModel,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCourseByIdQuery,
  GetEnrolledCoursesQuery,
} from "../course.type";
import { Course, CourseLesson, CourseStatus, Role } from "@prisma/client";
import { injectable } from "inversify";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import getCourseIncludeArg from "../../../common/functions/getCourseIncludeArg";
import getCourseFilter from "../../../common/functions/getCourseFilterRole";
import getCoursesIncludeQuery from "../../../common/functions/getCoursesIncludeQuery";

import "reflect-metadata";

export interface ICourseRepository {
  createCourse: (userId: number, dto: CreateCourseDto) => Promise<Course>;
  getCourseById: (
    courseId: number,
    query: GetCourseByIdQuery
  ) => Promise<Course>;
  getCourses: (query: GetCoursesQuery) => Promise<Course[]>;
  getEnrolledCourseById: (
    userId: number,
    courseId: number,
    query: GetEnrolledCourseByIdQuery
  ) => Promise<Course>;
  getEnrolledCourses: (
    userId: number,
    query: GetEnrolledCoursesQuery
  ) => Promise<EnrolledCourseModel[]>;
  getAuthor: (courseId: number) => Promise<BasicUser>;
  updateCourse: (
    courseId: number,
    dto: Partial<BasicCourseModel>
  ) => Promise<Course>;
  deleteCourse: (courseId: number) => Promise<{}>;
  createLike: (
    userId: number,
    resourceId: CourseLikeResourceId
  ) => Promise<CourseLikeModel>;
  deleteLike: (resourceId: CourseLikeResourceId) => Promise<{}>;
}

@injectable()
export class CourseRepository implements ICourseRepository {
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseTable = this.prisma.course;
  private readonly courseEnrollmentTable = this.prisma.courseEnrollment;
  private readonly courseCategoryTable = this.prisma.courseCategory;

  public async createCourse(
    userId: number,
    courseDetails: CreateCourseDto
  ): Promise<Course> {
    const newCourse = await this.courseTable.create({
      data: {
        ...courseDetails,
        authorId: userId,
      },
    });

    return newCourse;
  }

  public async getCourseById(
    courseId: number,
    query: GetCourseByIdQuery
  ): Promise<Course> {
    const includeArg = getCourseIncludeArg(query);

    let course = await this.courseTable.findFirstOrThrow({
      where: { id: courseId, status: CourseStatus.PUBLISHED },
      include: includeArg,
    });

    return course;
  }

  public async getCourses(query: GetCoursesQuery) {
    const { pageNumber, pageSize } = query;
    const includeArg = getCoursesIncludeQuery(query);

    const courses = await this.courseTable.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: includeArg,
    });

    return courses;
  }

  public async getEnrolledCourseById(
    userId: number,
    courseId: number,
    query: GetEnrolledCourseByIdQuery
  ): Promise<Course> {
    const { role } = query;
    const { course: enrolledCourse } =
      await this.courseEnrollmentTable.findFirstOrThrow({
        where: {
          userId,
          courseId,
          role,
        },
        select: {
          course: true,
        },
      });

    return enrolledCourse;
  }

  public async getEnrolledCourses(
    userId: number,
    query: GetEnrolledCoursesQuery
  ) {
    let enrolledCourses: EnrolledCourseModel[] = [];
    const courseIncludeArg = getCourseIncludeArg(query);
    const {
      include_student_courses,
      include_instructor_courses,
      include_owned_courses,
    } = query;

    if (include_student_courses) {
      const studentCourses = await this.courseEnrollmentTable.findMany({
        where: {
          userId,
          role: {
            in: getCourseFilter(query),
          },
        },
        select: { course: { include: courseIncludeArg } },
      });

      enrolledCourses = enrolledCourses.concat(
        studentCourses.map((studentCourse) => {
          return { course: studentCourse.course, role: Role.STUDENT };
        }) as EnrolledCourseModel[]
      );
    }

    if (include_instructor_courses) {
      const instructorCourses = await this.courseEnrollmentTable.findMany({
        where: {
          userId,
          role: {
            in: getCourseFilter(query),
          },
        },
        select: { course: { include: courseIncludeArg } },
      });

      enrolledCourses = enrolledCourses.concat(
        instructorCourses.map((instructorCourse) => {
          return { course: instructorCourse.course, role: Role.INSTRUCTOR };
        }) as EnrolledCourseModel[]
      );
    }

    if (include_owned_courses) {
      const ownedCourses = await this.courseTable.findMany({
        where: {
          authorId: userId,
        },
        include: courseIncludeArg,
      });

      enrolledCourses = enrolledCourses.concat(
        ownedCourses.map((ownedCourse) => {
          return {
            course: ownedCourse,
            role: Role.OWNER,
          };
        }) as EnrolledCourseModel[]
      );
    }

    return enrolledCourses;
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

  public async updateCourse(
    courseId: number,
    dto: Partial<BasicCourseModel>
  ): Promise<Course> {
    const updatedCourse = await this.courseTable.update({
      where: { id: courseId },
      data: dto,
    });

    return updatedCourse;
  }

  public async deleteCourse(courseId: number): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      let myCursor = -1;
      const findLesson = await tx.courseLesson.findFirst({
        where: {
          courseId,
        },
        orderBy: {
          id: "desc",
        },
        select: { id: true },
      });

      if (findLesson) {
        const { id: maxLessonId } = findLesson;
        let lesson: Pick<CourseLesson, "id">;
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
      }

      await Promise.all([
        tx.courseEnrollment.deleteMany({
          where: {
            courseId,
          },
        }),
        tx.courseLesson.deleteMany({
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

      await tx.course.delete({
        where: {
          id: courseId,
        },
      });
    });

    return {};
  }

  public async createLike(
    userId: number,
    resourceId: CourseLikeResourceId
  ): Promise<CourseLikeModel> {
    const { courseId } = resourceId;
    const newLike = await this.prisma.$transaction(async (tx) => {
      const [newLike] = await Promise.all([
        tx.courseLike.create({
          data: {
            courseId: courseId,
            userId,
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalLikes: { increment: 1 },
          },
        }),
      ]);

      return newLike;
    });

    return newLike;
  }

  public async deleteLike(resourceId: CourseLikeResourceId): Promise<{}> {
    const { courseId, likeId } = resourceId;
    await this.prisma.$transaction(async (tx) => {
      await Promise.all([
        // delete like
        tx.courseLike.delete({
          where: {
            id: likeId,
          },
          select: {
            id: true,
          },
        }),
        // update course
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalLikes: { decrement: 1 },
          },
          select: {
            id: true,
          },
        }),
      ]);
    });

    return {};
  }
}
