import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  IRandDB,
  ICourseCategoryRandDB,
  ICourseLessonRandDB,
  ICourseLessonVideoRandBD,
  ICourseRandDB,
  IUserRandDB,
  PrismaRandDBDITypes,
  ICourseEnrollmentRandDB,
} from "./rand.type";

@injectable()
export default class PrismaRandDB implements IRandDB {
  @inject(PrismaRandDBDITypes.USER)
  public readonly user: IUserRandDB;

  @inject(PrismaRandDBDITypes.COURSE)
  public readonly course: ICourseRandDB;

  @inject(PrismaRandDBDITypes.COURSE_CATEGORY)
  public readonly courseCategory: ICourseCategoryRandDB;

  @inject(PrismaRandDBDITypes.COURSE_ENROLLMENT)
  public readonly courseEnrollment: ICourseEnrollmentRandDB;

  @inject(PrismaRandDBDITypes.COURSE_LESSON)
  public readonly courseLesson: ICourseLessonRandDB;

  @inject(PrismaRandDBDITypes.COURSE_LESSON_VIDEO)
  public readonly courseLessonVideo: ICourseLessonVideoRandBD;
}
