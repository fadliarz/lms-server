import { CourseLessonVideo } from "@prisma/client";
import { injectable } from "inversify";
import {
  CourseLessonVideoResourceId,
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

export interface ICourseLessonVideoRepository {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideo>;
  getVideoById: (videoId: number) => Promise<CourseLessonVideo | null>;
  getVideoByIdOrThrow: (
    videoId: number,
    error?: Error,
  ) => Promise<CourseLessonVideo>;
  updateVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateCourseLessonVideoDto,
  ) => Promise<CourseLessonVideo>;
  deleteVideo: (
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ) => Promise<{}>;

  /**
   * Utils
   *
   */
}

@injectable()
export class CourseLessonVideoRepository
  implements ICourseLessonVideoRepository
{
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly videoTable = this.prisma.courseLessonVideo;

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    dto: CreateCourseLessonVideoDto,
  ): Promise<CourseLessonVideo> {
    const { courseId, lessonId } = resourceId;
    const { totalDurations } = dto;
    return await this.prisma.$transaction(async (tx) => {
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
    });
  }

  public async getVideoById(
    videoId: number,
  ): Promise<CourseLessonVideo | null> {
    return await this.videoTable.findUnique({
      where: {
        id: videoId,
      },
    });
  }

  public async getVideoByIdOrThrow(
    videoId: number,
    error?: Error,
  ): Promise<CourseLessonVideo> {
    const video = await this.getVideoById(videoId);
    if (!video) {
      throw error || new RecordNotFoundException();
    }

    return video;
  }

  public async updateVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
    dto: UpdateCourseLessonVideoDto,
  ) {
    const { courseId, lessonId } = resourceId;
    return await this.prisma.$transaction(async (tx) => {
      const video = await tx.courseLessonVideo.findUniqueOrThrow({
        where: {
          id: videoId,
        },
        select: {
          totalDurations: true,
        },
      });
      const { totalDurations: oldTotalDurations } = video;
      const { totalDurations } = dto;

      const [updatedVideo] = await Promise.all([
        // update video
        tx.courseLessonVideo.update({
          where: { id: videoId },
          data: dto,
        }),
        totalDurations
          ? // update lesson
            tx.courseLesson.update({
              where: {
                id: lessonId,
              },
              data: {
                totalDurations: {
                  increment: totalDurations - oldTotalDurations,
                },
              },
            })
          : undefined,
        // update course
        totalDurations
          ? tx.course.update({
              where: {
                id: courseId,
              },
              data: {
                totalDurations: {
                  increment: totalDurations - oldTotalDurations,
                },
              },
            })
          : undefined,
      ]);

      return updatedVideo;
    });
  }

  public async deleteVideo(
    videoId: number,
    resourceId: CourseLessonVideoResourceId,
  ): Promise<{}> {
    const { courseId, lessonId } = resourceId;
    await this.prisma.$transaction(async (tx) => {
      const video = await tx.courseLessonVideo.findUniqueOrThrow({
        where: {
          id: videoId,
        },
        select: {
          totalDurations: true,
        },
      });
      const { totalDurations } = video;

      await Promise.all([
        // delete video
        tx.courseLessonVideo.delete({
          where: {
            id: videoId,
          },
        }),
        // update lesson
        tx.courseLesson.update({
          where: {
            id: lessonId,
          },
          data: {
            totalVideos: { decrement: 1 },
            totalDurations: { decrement: totalDurations },
          },
        }),
        // update course
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
    });

    return {};
  }
}
