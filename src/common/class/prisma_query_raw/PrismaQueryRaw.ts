import "reflect-metadata";
import {
  ICourseCategoryPrismaQueryRaw,
  ICourseEnrollmentPrismaQueryRaw as ICourseEnrollmentQueryRaw,
  ICourseLessonPrismaQueryRaw,
  ICourseLessonVideoPrismaQueryRaw,
  ICoursePrismaQueryRaw,
  IDepartmentPrismaQueryRaw,
  IPrismaQueryRaw,
  IUserPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "./prisma_query_raw.type";
import { inject, injectable } from "inversify";

@injectable()
export default class PrismaQueryRaw implements IPrismaQueryRaw {
  @inject(PrismaQueryRawDITypes.USER)
  public readonly user: IUserPrismaQueryRaw;

  @inject(PrismaQueryRawDITypes.COURSE)
  public readonly course: ICoursePrismaQueryRaw;

  @inject(PrismaQueryRawDITypes.COURSE_CATEGORY)
  public readonly courseCategory: ICourseCategoryPrismaQueryRaw;

  @inject(PrismaQueryRawDITypes.COURSE_ENROLLMENT)
  public readonly courseEnrollment: ICourseEnrollmentQueryRaw;

  @inject(PrismaQueryRawDITypes.COURSE_LESSON)
  public readonly courseLesson: ICourseLessonPrismaQueryRaw;

  @inject(PrismaQueryRawDITypes.COURSE_LESSON_VIDEO)
  public readonly courseLessonVideo: ICourseLessonVideoPrismaQueryRaw;

  @inject(PrismaQueryRawDITypes.DEPARTMENT)
  public readonly department: IDepartmentPrismaQueryRaw;
}
