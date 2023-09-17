import { inject, injectable } from "inversify";
import {
  CourseModel,
  GetCourseQuery,
  GetCourseByIdDto,
  GetCoursesQuery,
  DeleteCourseLikeIds,
  CreateCourseLikeIds,
  CourseCategoryModel,
} from "../course.type";
import { CreateCourseDto, UpdateCourseDto } from "../course.type";
import { CourseDITypes } from "../course.type";
import getValuable from "../../../common/functions/getValuable";
import { ICourseRepository } from "../repository/course.repository";
import { Course, CourseCategory, Role } from "@prisma/client";
import processQuery from "../../../common/functions/processQuery";
import isEqualOrIncludeRole from "../../../common/functions/isEqualOrIncludeRole";

export interface ICourseService {
  getCategories: () => Promise<CourseCategoryModel[]>;
  deleteLike: (
    likeId: number,
    ids: DeleteCourseLikeIds
  ) => Promise<Pick<Course, "totalLikes">>;
  createLike: (
    userId: number,
    ids: CreateCourseLikeIds
  ) => Promise<Pick<Course, "totalLikes">>;
  delete: (courseId: number) => Promise<CourseModel>;
  create: (
    userId: number,
    courseDetails: CreateCourseDto
  ) => Promise<CourseModel>;
  update: (
    courseId: number,
    courseDetails: UpdateCourseDto
  ) => Promise<CourseModel>;
  getById: (
    courseId: number,
    query: GetCourseQuery
  ) => Promise<GetCourseByIdDto>;
  getMany: (
    userId: number,
    query: GetCoursesQuery
  ) => Promise<{
    ownedCourses?: Course[];
    studentCourses?: Course[];
    instructorCourses?: Course[];
  }>;
}

@injectable()
export class CourseService implements ICourseService {
  @inject(CourseDITypes.REPOSITORY)
  private readonly repository: ICourseRepository;

  public async getCategories(): Promise<CourseCategory[]> {
    const categories = await this.repository.getCategories();

    return categories;
  }

  public async deleteLike(
    likeId: number,
    ids: DeleteCourseLikeIds
  ): Promise<Pick<Course, "totalLikes">> {
    const like = await this.repository.deleteLike(likeId, ids);

    return like;
  }

  public async createLike(
    userId: number,
    ids: CreateCourseLikeIds
  ): Promise<Pick<Course, "totalLikes">> {
    const like = await this.repository.createLike(userId, ids);

    return like;
  }

  public async delete(courseId: number): Promise<CourseModel> {
    const deletedCourse = await this.repository.delete(courseId);

    return getValuable(deletedCourse);
  }

  public async create(
    userId: number,
    courseDetails: CreateCourseDto
  ): Promise<CourseModel> {
    const course = await this.repository.create(userId, courseDetails);

    return getValuable(course);
  }

  public async update(
    courseId: number,
    courseDetails: UpdateCourseDto
  ): Promise<CourseModel> {
    const course = await this.repository.update(courseId, courseDetails);

    return getValuable(course);
  }

  public async getById(
    courseId: number,
    query: GetCourseQuery
  ): Promise<GetCourseByIdDto> {
    let course = (await this.repository.getById(
      courseId,
      query
    )) as GetCourseByIdDto;

    const { include_instructors, include_students, include_author } =
      processQuery(query);

    if (include_students || include_instructors) {
      const { students, instructors } =
        await this.repository.getManyCourseEnrollers(courseId, {
          students: include_students,
          instructors: include_instructors,
        });

      if (students) {
        course = { ...course, students };
      }

      if (instructors) {
        course = { ...course, instructors };
      }
    }

    if (include_author) {
      const author = await this.repository.getAuthor(courseId);

      course = { ...course, author };
    }

    return course;
  }

  public async getMany(
    userId: number,
    query: GetCoursesQuery
  ): Promise<{
    ownedCourses?: Course[];
    studentCourses?: Course[];
    instructorCourses?: Course[];
  }> {
    const {
      include_owned_courses,
      include_student_courses,
      include_instructor_courses,
    } = processQuery({
      include_owned_courses: query.include_owned_courses,
      include_instructor_courses: query.include_instructor_courses,
      include_student_courses: query.include_student_courses,
    });

    let courses: {
      ownedCourses?: Course[];
      studentCourses?: Course[];
      instructorCourses?: Course[];
    } = {};

    if (include_owned_courses) {
      const ownedCourses = await this.repository.getManyOwnedCourses(
        userId,
        query
      );

      courses.ownedCourses = ownedCourses;
    }

    const roles: Role[] = [];
    if (include_student_courses) {
      roles.push(Role.STUDENT);
    }

    if (include_instructor_courses) {
      roles.push(Role.INSTRUCTOR);
    }

    let studentCourses: Course[] = [];
    let instructorCourses: Course[] = [];

    if (roles.length > 0) {
      const enrolledCourses = await this.repository.getManyEnrolledCourses(
        userId,
        roles,
        query
      );

      enrolledCourses.forEach((enrolledCourse) => {
        if (isEqualOrIncludeRole(enrolledCourse.role, Role.STUDENT)) {
          studentCourses.push(enrolledCourse.course);
        }

        if (isEqualOrIncludeRole(enrolledCourse.role, Role.INSTRUCTOR)) {
          instructorCourses.push(enrolledCourse.course);
        }
      });
    }

    if (include_student_courses) {
      courses.studentCourses = studentCourses;
    }

    if (include_instructor_courses) {
      courses.instructorCourses = instructorCourses;
    }

    return courses;
  }
}
