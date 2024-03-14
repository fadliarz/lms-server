import Joi from "joi";
import {
  CourseEnrollmentRoleModel,
  CourseStatusModel,
  CreateCourseDto,
  CreateCourseLikeDto,
  GetCourseByIdQuery,
  GetCoursesQuery,
  GetEnrolledCoursesQuery,
  UpdateCourseCategoryIdDto,
  UpdateCourseDto,
  UpdateCourseStatusDto,
} from "../course.type";
import { CourseStatus } from "@prisma/client";

/**
 * CreateCourse
 *
 */
export const CreateCourseDtoJoi = Joi.object<CreateCourseDto>({
  title: Joi.string().required(),
  categoryId: Joi.number().required(),
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
  include_lessons: Joi.boolean(),
  include_public_videos: Joi.boolean(),
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
 * GetEnrolledCourses
 *
 */
export const GetEnrolledCoursesQueryJoi = Joi.object<GetEnrolledCoursesQuery>({
  /**
   * Include
   */
  include_author: Joi.boolean(),
  include_category: Joi.boolean(),
  // role: "addSoon",
  /**
   * Limit
   */
  limit_student_courses: Joi.number(),
  limit_instructor_courses: Joi.number(),
});

/**
 * UpdateCourse
 */
export const UpdateBasicCourseDtoJoi = Joi.object<UpdateCourseDto>({
  description: Joi.string(),
  image: Joi.string(),
  title: Joi.string(),
  material: Joi.string(),
});

export const UpdateCourseStatusDtoJoi = Joi.object<UpdateCourseStatusDto>({
  status: Joi.required().valid(
    CourseStatusModel.DRAFT,
    CourseStatusModel.PUBLISHED,
  ),
});

export const UpdateCourseCategoryIdDtoJoi =
  Joi.object<UpdateCourseCategoryIdDto>({
    categoryId: Joi.number().required(),
  });

/**
 * CreateCourseLike
 *
 */
export const CreateCourseLikeDtoJoi = Joi.object<CreateCourseLikeDto>({});
