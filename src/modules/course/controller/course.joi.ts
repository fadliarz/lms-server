import Joi from "joi";
import {
  CreateCourseDto,
  CreateCourseLikeDto,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCourseByIdQuery,
  GetEnrolledCoursesQuery,
  UpdateCourseDto,
} from "../course.type";
import { CourseStatus, Role } from "@prisma/client";

/**
 * CreateCourse
 *
 */
export const CreateCourseDtoJoi = Joi.object<CreateCourseDto>({
  // required
  title: Joi.string().required(),
  categoryId: Joi.number().required(),
  // optional
  image: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
});

/**
 * GetCourseById
 *
 */
export const GetCourseByIdQueryJoi = Joi.object<GetCourseByIdQuery>({
  /**
   * Include
   */
  include_author: Joi.boolean(),
  include_category: Joi.boolean(),
  include_students: Joi.boolean(),
  include_instructors: Joi.boolean(),
  include_basic_lessons_and_videos: Joi.boolean(),
});

/**
 * GetCourses
 *
 */
export const GetCoursesQueryJoi = Joi.object<GetCoursesQuery>({
  /**
   * Include
   */
  include_author: Joi.boolean(),
  include_category: Joi.boolean(),
  /**
   * Limit
   */
  pageSize: Joi.number().required().min(1).max(10),
  pageNumber: Joi.number().required().min(1),
});

/**
 * GetEnrolledCourseById
 *
 */
export const GetEnrolledCourseByIdQueryJoi =
  Joi.object<GetEnrolledCourseByIdQuery>({
    /**
     * Include
     */
    include_author: Joi.boolean(),
    include_category: Joi.boolean(),
    include_students: Joi.boolean(),
    include_instructors: Joi.boolean(),
    include_playlist: Joi.boolean(),
    /**
     * Role
     */
    role: Joi.valid(Role.STUDENT, Role.INSTRUCTOR),
  });

/**
 * GetEnrolledCourses
 *
 */
export const GetEnrolledCoursesQueryJoi = Joi.object<GetEnrolledCoursesQuery>({
  /**
   * Include
   */
  include_author: Joi.boolean(),
  include_category: Joi.boolean(),
  include_student_courses: Joi.boolean(),
  include_instructor_courses: Joi.boolean(),
  /**
   * Limit
   */
  limit_student_courses: Joi.number(),
  limit_instructor_courses: Joi.number(),
})
  .with("include_student_courses", "limit_student_courses")
  .with("include_instructor_courses", "limit_instructor_courses")
  .or("student_courses", "instructor_courses");

/**
 * UpdateCourse
 */
export const UpdateCourseDtoJoi = Joi.object<UpdateCourseDto>({
  title: Joi.string(),
  categoryId: Joi.number(),
  image: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
  status: Joi.string().valid(CourseStatus.PUBLISHED, CourseStatus.DRAFT),
});

/**
 * CreateCourseLike
 *
 */
export const CreateCourseLikeDtoJoi = Joi.object<CreateCourseLikeDto>({});
