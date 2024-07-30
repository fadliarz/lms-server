import "reflect-metadata";
import { IRepository } from "./repository.type";
import { ICourseLessonVideoRepository } from "../../../modules/video/repository/video.repository";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../../../modules/user/user.type";
import { CourseDITypes } from "../../../modules/course/course.type";
import { CourseEnrollmentDITypes } from "../../../modules/enrollment/enrollment.type";
import { CourseCategoryDITypes } from "../../../modules/category/category.type";
import { CourseLessonDITypes } from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoDITypes } from "../../../modules/video/video.type";
import { CourseClassDITypes } from "../../../modules/class/class.type";
import { CourseClassAssignmentDITypes } from "../../../modules/assignment/assignment.type";
import { ICourseClassAssignmentRepository } from "../../../modules/assignment/assignment.interface";
import { ICourseCategoryRepository } from "../../../modules/category/category.interface";
import { ICourseRepository } from "../../../modules/course/course.interface";
import { ICourseClassRepository } from "../../../modules/class/class.interface";
import { ICourseEnrollmentRepository } from "../../../modules/enrollment/enrollment.interface";
import { ICourseLessonRepository } from "../../../modules/lesson/lesson.interface";
import { IUserRepository } from "../../../modules/user/user.interface";

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
