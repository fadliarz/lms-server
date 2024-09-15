import Joi from "joi";
import { CourseEnrollmentRoleModel, CourseStatusModel } from "../course.type";
import { $CourseAPI } from "../course.api";

export const CreateCourseDtoJoi = Joi.object<$CourseAPI.CreateCourse.Dto>({
  code: Joi.string().required(),
  title: Joi.string().required(),
  categoryId: Joi.number().required(),
  image: Joi.string(),
  description: Joi.string(),
  material: Joi.string(),
});

export const CreateCourseInstructorDtoJoi =
  Joi.object<$CourseAPI.CreateCourseInstructor.Dto>({
    userId: Joi.number().required(),
  });

export const GetCourseByIdQueryJoi = Joi.object<$CourseAPI.GetCourseById.Query>(
  {
    include_category: Joi.boolean(),
    include_lessons: Joi.boolean(),
    include_public_videos: Joi.boolean(),
  },
);

export const GetCoursesQueryJoi = Joi.object<$CourseAPI.GetCourses.Query>({
  include_category: Joi.boolean(),
  pageSize: Joi.number(),
  pageNumber: Joi.number(),
});

export const GetCourseInstructorsQueryJoi =
  Joi.object<$CourseAPI.GetCourseInstructors.Query>({
    pageSize: Joi.number(),
    pageNumber: Joi.number(),
  });

/**
 *
 */
export type GetEnrolledCoursesQuery = {
  /**
   * Include
   *
   */
  include_category: boolean;
  role: CourseEnrollmentRoleModel[];
  /**
   * Limit
   *
   */
  limit_student_courses: number;
  limit_instructor_courses: number;
};

export const GetEnrolledCoursesQueryJoi = Joi.object<GetEnrolledCoursesQuery>({
  include_category: Joi.boolean(),
  role: Joi.array()
    .items(
      CourseEnrollmentRoleModel.STUDENT,
      CourseEnrollmentRoleModel.INSTRUCTOR,
    )
    .required(),
  limit_student_courses: Joi.number(),
  limit_instructor_courses: Joi.number(),
});
/**
 *
 */

export const UpdateCourseDtoJoi = Joi.object<$CourseAPI.UpdateCourse.Dto>({
  description: Joi.string(),
  image: Joi.string(),
  title: Joi.string(),
  material: Joi.string(),
});

export const UpdateCourseStatusDtoJoi =
  Joi.object<$CourseAPI.UpdateCourseStatus.Dto>({
    status: Joi.required().valid(
      CourseStatusModel.DRAFT,
      CourseStatusModel.PUBLISHED,
    ),
  });

export const UpdateCourseCategoryIdDtoJoi =
  Joi.object<$CourseAPI.UpdateCourseCategoryId.Dto>({
    categoryId: Joi.number().required(),
  });

export const UpdateCourseCodeDtoJoi =
  Joi.object<$CourseAPI.UpdateCourseCode.Dto>({
    code: Joi.string().required(),
  });

export const CreateCourseLikeDtoJoi = Joi.object<$CourseAPI.CreateLike.Dto>({});
