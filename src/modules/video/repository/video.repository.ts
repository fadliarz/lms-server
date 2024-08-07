import "reflect-metadata";
import { inject, injectable } from "inversify";
import {
  CourseLessonVideoDITypes,
  CourseLessonVideoModel,
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  ICourseLessonVideoAuthorization,
} from "../video.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import {
  PrismaDefaultTransactionConfigForRead,
  PrismaDefaultTransactionConfigForWrite,
} from "../../../common/constants/prismaDefaultConfig";
import BaseAuthorization from "../../../common/class/BaseAuthorization";

export interface ICourseLessonVideoRepository {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideoModel>;
  getVideoById: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideoModel | null>;
  getVideoByIdOrThrow: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    error?: Error,
  ) => Promise<CourseLessonVideoModel>;
  getVideos: (
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<CourseLessonVideoModel[]>;
  updateVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: Partial<CourseLessonVideoModel>,
  ) => Promise<CourseLessonVideoModel>;
  deleteVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<{}>;
}

@injectable()
export class CourseLessonVideoRepository
  extends BaseAuthorization
  implements ICourseLessonVideoRepository
{
  private readonly prisma = PrismaClientSingleton.getInstance();

  @inject(CourseLessonVideoDITypes.AUTHORIZATION)
  private readonly authorization: ICourseLessonVideoAuthorization;

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ): Promise<CourseLessonVideoModel> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeCreateVideo.bind(this.authorization),
      );
      const { lessonId } = resourceId;

      return await tx.courseLessonVideo.create({
        data: {
          ...dto,
          lessonId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async getVideoById(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel | null> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeGetVideo.bind(this.authorization),
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
  ): Promise<CourseLessonVideoModel> {
    const video = await this.getVideoById(videoId, resourceId);
    if (!video) {
      throw error || new RecordNotFoundException();
    }

    return video;
  }

  public async getVideos(
    resourceId: CourseLessonVideoResourceId,
  ): Promise<CourseLessonVideoModel[]> {
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeGetVideos.bind(this.authorization),
      );

      const { lessonId } = resourceId;
      return await tx.courseLessonVideo.findMany({
        where: {
          lessonId,
        },
      });
    }, PrismaDefaultTransactionConfigForRead);
  }

  public async updateVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: Partial<CourseLessonVideoModel>,
  ) {
    const { courseId, lessonId } = resourceId;
    return await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateVideo.bind(this.authorization),
      );

      return await tx.courseLessonVideo.update({
        where: { id: videoId },
        data: dto,
      });
    }, PrismaDefaultTransactionConfigForWrite);
  }

  public async deleteVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<{}> {
    await this.prisma.$transaction(async (tx) => {
      await this.authorize(
        tx,
        resourceId,
        this.authorization.authorizeUpdateVideo.bind(this.authorization),
      );

      await tx.courseLessonVideo.delete({
        where: {
          id: videoId,
        },
      });
    }, PrismaDefaultTransactionConfigForWrite);

    return {};
  }
}
