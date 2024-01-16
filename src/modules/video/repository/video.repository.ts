import { CourseLessonVideo } from "@prisma/client";
import { injectable } from "inversify";
import {
  CreateCourseLessonVideoDto,
  CourseLessonVideoResourceId,
  UpdateCourseLessonVideoDto,
} from "../video.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export interface ICourseLessonVideoRepository {
  createVideo: (
    resourceId: CourseLessonVideoResourceId,
    videoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
  getVideoById: (
    resourceId: CourseLessonVideoResourceId
  ) => Promise<CourseLessonVideo>;
  updateVideo: (
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
  deleteVideo: (resourceId: CourseLessonVideoResourceId) => Promise<{}>;
}

@injectable()
export class CourseLessonVideoRepository
  implements ICourseLessonVideoRepository
{
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly videoTable = this.prisma.courseLessonVideo;

  public async createVideo(
    resourceId: CourseLessonVideoResourceId,
    videoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    const { courseId, lessonId } = resourceId;
    const { totalDurations } = videoDetails;

    const video = await this.prisma.$transaction(async (tx) => {
      const [video] = await Promise.all([
        // create video
        tx.courseLessonVideo.create({
          data: {
            ...videoDetails,
            lessonId,
          },
        }),
        // update lesson count
        tx.courseLesson.update({
          where: {
            id: lessonId,
          },
          data: {
            totalVideos: { increment: 1 },
            totalDurations: { increment: totalDurations },
          },
        }),
        // update course count
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

    return video;
  }

  public async getVideoById(
    resourceId: CourseLessonVideoResourceId
  ): Promise<CourseLessonVideo> {
    const { videoId } = resourceId;
    const video = await this.videoTable.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    return video;
  }

  public async updateVideo(
    resourceId: CourseLessonVideoResourceId,
    videoDetails: UpdateCourseLessonVideoDto
  ) {
    const { courseId, lessonId, videoId } = resourceId;
    const updatedVideo = await this.prisma.$transaction(async (tx) => {
      const video = await tx.courseLessonVideo.findUniqueOrThrow({
        where: {
          id: videoId,
        },
        select: {
          totalDurations: true,
        },
      });
      const { totalDurations: oldTotalDurations } = video;
      const { totalDurations } = videoDetails;

      const [updatedVideo] = await Promise.all([
        // update video
        tx.courseLessonVideo.update({
          where: { id: videoId },
          data: videoDetails,
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

    return updatedVideo;
  }

  public async deleteVideo(
    resourceId: CourseLessonVideoResourceId
  ): Promise<{}> {
    const { courseId, lessonId, videoId } = resourceId;
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
