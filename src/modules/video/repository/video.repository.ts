import {
  Course,
  CourseEnrollment,
  CourseLesson,
  CourseLessonVideo,
  User,
} from "@prisma/client";
import { inject, injectable } from "inversify";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  ICourseLessonVideoAuthorization,
  UpdateCourseLessonVideoSourceDto,
} from "../video.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  IPrismaQueryRaw,
  PrismaQueryRawDITypes,
} from "../../../common/class/prisma_query_raw/prisma_query_raw.type";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import { PrismaTransaction } from "../../../common/types";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import InternalServerException from "../../../common/class/exceptions/InternalServerException";
import CourseLessonVideoAuthorization from "../authorization/video.authorization";
import { TableName } from "../../../common/constants/tableName";

export interface ICourseLessonVideoRepository {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideo>;
  getVideoById: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideo | null>;
  getVideoByIdOrThrow: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    error?: Error,
  ) => Promise<CourseLessonVideo>;
  updateVideoSource: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateCourseLessonVideoSourceDto,
  ) => Promise<CourseLessonVideo>;
  deleteVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonVideoRepository
  implements ICourseLessonVideoRepository
{
  @inject(CourseLessonVideoDITypes.AUTHORIZATION)
  private readonly authorization: ICourseLessonVideoAuthorization;

  @inject(PrismaQueryRawDITypes.PRISMA_QUERY_RAW)
  private readonly prismaQueryRaw: IPrismaQueryRaw;

  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly videoTable = this.prisma.courseLessonVideo;

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ): Promise<CourseLessonVideo> {
    return await this.prisma.$transaction(async (tx) => {
      const { courseId, lessonId } = resourceId;
      const { totalDurations } = dto;
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateVideo,
      );
      await this.validateRelationBetweenResources(tx, { resourceId });

      const [video] = await Promise.all([
        tx.courseLessonVideo.create({
          data: {
            ...dto,
            lessonId,
          },
        }),
        tx.courseLesson.update({
          where: {
            id: lessonId,
          },
          data: {
            totalVideos: { increment: 1 },
            totalDurations: { increment: totalDurations },
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalVideos: { increment: 1 },
            totalDurations: { increment: totalDurations },
          },
        }),
      ]);

      return video;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getVideoById(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideo | null> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeGetVideo,
      );

      return await tx.courseLessonVideo.findUnique({
        where: {
          id: videoId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async getVideoByIdOrThrow(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    error?: Error,
  ): Promise<CourseLessonVideo> {
    const video = await this.getVideoById(videoId, resourceId);
    if (!video) {
      throw error || new RecordNotFoundException();
    }

    return video;
  }

  public async updateVideoSource(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateCourseLessonVideoSourceDto,
  ) {
    const { courseId, lessonId } = resourceId;
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateVideo,
      );
      const { video } = await this.validateRelationBetweenResources(tx, {
        videoId,
        resourceId,
      });
      const { totalDurations: oldTotalDurations } = video;
      const { totalDurations } = dto;

      const [updatedVideo] = await Promise.all([
        tx.courseLessonVideo.update({
          where: { id: videoId },
          data: dto,
        }),
        tx.courseLesson.update({
          where: {
            id: lessonId,
          },
          data: {
            totalDurations: {
              increment: totalDurations - oldTotalDurations,
            },
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalDurations: {
              increment: totalDurations - oldTotalDurations,
            },
          },
        }),
      ]);

      return updatedVideo;
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      const { courseId, lessonId } = resourceId;
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateVideo,
      );
      const { video } = await this.validateRelationBetweenResources(tx, {
        videoId,
        resourceId,
      });
      const { totalDurations } = video;

      await Promise.all([
        tx.courseLessonVideo.delete({
          where: {
            id: videoId,
          },
        }),
        tx.courseLesson.update({
          where: {
            id: lessonId,
          },
          data: {
            totalVideos: { decrement: 1 },
            totalDurations: { decrement: totalDurations },
          },
        }),
        tx.course.update({
          where: {
            id: courseId,
          },
          data: {
            totalVideos: { decrement: 1 },
            totalDurations: { decrement: totalDurations },
          },
        }),
      ]);
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }

  private async authorize(
    tx: PrismaTransaction,
    resourceId: CourseLessonVideoResourceId,
    fn:
      | typeof CourseLessonVideoAuthorization.prototype.authorizeCreateVideo
      | typeof CourseLessonVideoAuthorization.prototype.authorizeGetVideo
      | typeof CourseLessonVideoAuthorization.prototype.authorizeUpdateVideo
      | typeof CourseLessonVideoAuthorization.prototype.authorizeDeleteVideo,
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
      resourceId: CourseLessonVideoResourceId;
    },
    error?: Error,
  ): Promise<CourseLesson>;
  private async validateRelationBetweenResources(
    tx: PrismaTransaction,
    id: {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
    error?: Error,
  ): Promise<{ lesson: CourseLesson; video: CourseLessonVideo }>;
  private async validateRelationBetweenResources<
    T1 extends {
      resourceId: CourseLessonVideoResourceId;
    },
    T2 extends {
      videoId: number;
      resourceId: CourseLessonVideoResourceId;
    },
  >(
    tx: PrismaTransaction,
    id: T1 | T2,
    error?: Error,
  ): Promise<
    | CourseLesson
    | {
        lesson: CourseLesson;
        video: CourseLessonVideo;
      }
  > {
    const {
      resourceId: { courseId, lessonId },
    } = id;

    const lesson =
      await this.prismaQueryRaw.courseLesson.selectForUpdateByIdOrThrow(
        tx,
        lessonId,
      );

    if (lesson.courseId !== courseId) {
      throw error || new RecordNotFoundException();
    }

    if ((id as T2).videoId) {
      const { videoId } = id as T2;
      const video =
        await this.prismaQueryRaw.courseLessonVideo.selectForUpdateByIdOrThrow(
          tx,
          videoId,
        );
      if (video.lessonId !== lessonId) {
        throw error || new RecordNotFoundException();
      }

      if (videoId) {
        return {
          lesson,
          video,
        };
      }
    }

    return lesson;
  }
}
