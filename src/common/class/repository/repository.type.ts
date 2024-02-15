import { IUserRepository } from "../../../modules/user/repository/user.repository";
import { ICourseCategoryRepository } from "../../../modules/category/repository/category.repository";
import { ICourseRepository } from "../../../modules/course/repository/course.repository";
import { ICourseLessonRepository } from "../../../modules/lesson/repository/lesson.repository";
import { ICourseLessonVideoRepository } from "../../../modules/video/repository/video.repository";
import { ICourseEnrollmentRepository } from "../../../modules/enrollment/repository/enrollment.repository";

export const RepositoryDITypes = {
  FACADE: Symbol.for("FACADE_REPOSITORY"),
};

export class IRepository {
  user: IUserRepository;
  courseCategory: ICourseCategoryRepository;
  courseEnrollment: ICourseEnrollmentRepository;
  course: ICourseRepository;
  courseLesson: ICourseLessonRepository;
  courseLessonVideo: ICourseLessonVideoRepository;
}
