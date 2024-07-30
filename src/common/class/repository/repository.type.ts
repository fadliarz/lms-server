import { ICourseLessonVideoRepository } from "../../../modules/video/repository/video.repository";
import { ICourseClassAssignmentRepository } from "../../../modules/assignment/assignment.interface";
import { ICourseCategoryRepository } from "../../../modules/category/category.interface";
import { ICourseRepository } from "../../../modules/course/course.interface";
import { ICourseClassRepository } from "../../../modules/class/class.interface";
import { ICourseEnrollmentRepository } from "../../../modules/enrollment/enrollment.interface";
import { ICourseLessonRepository } from "../../../modules/lesson/lesson.interface";
import { IUserRepository } from "../../../modules/user/user.interface";

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
  courseClass: ICourseClassRepository;
  courseClassAssignment: ICourseClassAssignmentRepository;
}
