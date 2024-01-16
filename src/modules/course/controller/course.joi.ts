import Joi from "joi";
import {
  CreateCourseDto,
  CreateCourseLikeDto,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCourseByIdQuery,
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
  include_playlist: Joi.boolean(),
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
// export const GetCoursesQueryJoi = Joi.object<GetCoursesQuery>({
//   student_courses: Joi.boolean(),
//   instructor_courses: Joi.boolean(),
//   owned_courses: Joi.boolean(),
//   limit_student_courses: Joi.number().integer(),
//   limit_instructor_courses: Joi.number().integer(),
//   limit_owned_courses: Joi.number().integer(),
//   category_id: Joi.alternatives().try(
//     Joi.number().integer(),
//     Joi.array().items(Joi.number().integer())
//   ),
//   include_author: Joi.boolean(),
//   include_category: Joi.boolean(),
//   include_students: Joi.boolean(),
//   include_instructors: Joi.boolean(),
//   include_lessons: Joi.boolean(),
//   include_likes: Joi.boolean(),
//   include_videos: Joi.boolean(),
// })
//   .with("student_courses", "limit_student_courses")
//   .with("instructor_courses", "limit_instructor_courses")
//   .with("owned_courses", "limit_owned_courses")
//   .or("student_courses", "instructor_courses", "owned_courses");

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
