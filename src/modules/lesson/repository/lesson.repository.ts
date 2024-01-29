import "reflect-metadata";
import {
  Course,
  CourseEnrollment,
  CourseLesson,
  Prisma,
  User,
} from "@prisma/client";
import { inject, injectable } from "inversify";
import {
  CourseLessonDITypes,
  CourseLessonResourceId,
  CreateCourseLessonDto,
  ICourseLessonAuthorization,
  UpdateCourseLessonDto,
} from "../lesson.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import {
  IPrismaPromise,
  PrismaPromiseDITypes,
} from "../../../common/class/prisma_promise/prisma_promise.type";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import { PrismaTransaction } from "../../../common/types";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";

export interface ICourseLessonRepository {
  createLesson: (
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ) => Promise<CourseLesson>;
  getLessonById: (lessonId: number) => Promise<CourseLesson | null>;
  getLessonByIdOrThrow: (
    lessonId: number,
    error?: Error,
  ) => Promise<CourseLesson>;
  updateLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ) => Promise<CourseLesson>;
  deleteLesson: (
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonRepository implements ICourseLessonRepository {
  @inject(CourseLessonDITypes.AUTHORIZATION)
  private readonly authorization: ICourseLessonAuthorization;

  @inject(PrismaPromiseDITypes.PRISMA_PROMISE)
  private readonly prismaPromise: IPrismaPromise;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseLessonTable = this.prisma.courseLesson;

  public async createLesson(
    resourceId: CourseLessonResourceId,
    dto: CreateCourseLessonDto,
  ): Promise<CourseLesson> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateLesson,
      );

      const [newLesson] = await Promise.all([
        tx.courseLesson.create({
          data: {
            ...dto,
            courseId,
          },
        }),
        this.prismaPromise.course.incrementTotalLessons(tx, courseId, 1),
      ]);

      return newLesson;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getLessonById(lessonId: number): Promise<CourseLesson | null> {
    return await this.prisma.$transaction(async (tx) => {
      return tx.courseLesson.findUnique({
        where: {
          id: lessonId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getLessonByIdOrThrow(
    lessonId: number,
    error?: Error,
  ): Promise<CourseLesson> {
    const lesson = await this.getLessonById(lessonId);

    if (!lesson) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }

  public async updateLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
    dto: UpdateCourseLessonDto,
  ): Promise<CourseLesson> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateLesson,
      );
      await this.validateRelationBetweenResources(tx, {
        lessonId,
        resourceId,
      });

      const updatedLesson = await tx.courseLesson.update({
        where: {
          id: lessonId,
        },
        data: dto,
      });

      return updatedLesson;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteLesson(
    lessonId: number,
    resourceId: CourseLessonResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      const { courseId } = resourceId;
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeDeleteLesson,
      );
      const lesson = await this.validateRelationBetweenResources(tx, {
        lessonId,
        resourceId,
      });

      await tx.courseLessonVideo.deleteMany({
        where: {
          lessonId,
        },
      });

      await Promise.all([
        tx.courseLesson.delete({
          where: {
            id: lessonId,
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalDurations: { decrement: lesson.totalDurations },
            totalLessons: { decrement: 1 },
          },
        }),
      ]);
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }

  private async authorize(
    tx: PrismaTransaction,
    resourceId: CourseLessonResourceId,
    fn: (
      user: User,
      course: Course,
      enrollment: CourseEnrollment | null,
    ) => void,
  ): Promise<{
    user: User;
    course: Course;
    enrollment: CourseEnrollment | null;
  }> {
    const { userId, courseId } = resourceId;
    const user = await this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(
      tx,
      userId,
    );
    const course = await this.prismaQueryRaw.course.selectForUpdateByIdOrThrow(
      tx,
      courseId,
    );
    const enrollment =
      await this.prismaQueryRaw.courseEnrollment.selectForUpdateByUserIdAndCourseId(
        tx,
        {
          userId,
          courseId,
        },
      );

    const { isStudent, isInstructor, isAdmin } = getRoleStatus(user.role);
    if (!(isStudent || isInstructor || isAdmin)) {
      throw new InternalServerException();
    }

    fn(user, course, enrollment);

    return {
      user,
      course,
      enrollment,
    };
  }

  private async validateRelationBetweenResources(
    tx: PrismaTransaction,
    id: {
      lessonId: number;
      resourceId: CourseLessonResourceId;
    },
    error?: Error,
  ): Promise<CourseLesson> {
    const {
      lessonId,
      resourceId: { courseId },
    } = id;
    const lesson =
      await this.prismaQueryRaw.courseLesson.selectForUpdateByIdOrThrow(
        tx,
        lessonId,
      );

    if (lesson.courseId !== courseId) {
      throw error || new RecordNotFoundException();
    }

    return lesson;
  }
}
