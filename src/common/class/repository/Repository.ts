import "reflect-metadata";
import { IRepository } from "./repository.type";
import { IUserRepository } from "../../../modules/user/repository/user.repository";
import { ICourseCategoryRepository } from "../../../modules/category/repository/category.repository";
import { ICourseRepository } from "../../../modules/course/repository/course.repository";
import { ICourseLessonRepository } from "../../../modules/lesson/repository/lesson.repository";
import { ICourseLessonVideoRepository } from "../../../modules/video/repository/video.repository";
import { ICourseEnrollmentRepository } from "../../../modules/enrollment/repository/enrollment.repository";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../../../modules/user/user.type";
import { CourseDITypes } from "../../../modules/course/course.type";
import { CourseEnrollmentDITypes } from "../../../modules/enrollment/enrollment.type";
import { CourseCategoryDITypes } from "../../../modules/category/category.type";
import { CourseLessonDITypes } from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoDITypes } from "../../../modules/video/video.type";
import {
  CourseClassDITypes,
  ICourseClassRepository,
} from "../../../modules/class/class.type";
import {
  CourseClassAssignmentDITypes,
  ICourseClassAssignmentRepository,
} from "../../../modules/assignment/assignment.type";

@injectable()
export default class Repository implements IRepository {
  @inject(UserDITypes.REPOSITORY)
  public readonly user: IUserRepository;

  @inject(CourseCategoryDITypes.REPOSITORY)
  public readonly courseCategory: ICourseCategoryRepository;

  @inject(CourseEnrollmentDITypes.REPOSITORY)
  public readonly courseEnrollment: ICourseEnrollmentRepository;

  @inject(CourseDITypes.REPOSITORY)
  public readonly course: ICourseRepository;

  @inject(CourseLessonDITypes.REPOSITORY)
  public readonly courseLesson: ICourseLessonRepository;

  @inject(CourseLessonVideoDITypes.REPOSITORY)
  public readonly courseLessonVideo: ICourseLessonVideoRepository;

  @inject(CourseClassDITypes.REPOSITORY)
  public readonly courseClass: ICourseClassRepository;

  @inject(CourseClassAssignmentDITypes.REPOSITORY)
  public readonly courseClassAssignment: ICourseClassAssignmentRepository;
}
