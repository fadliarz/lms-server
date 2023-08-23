import { CourseLessonVideo } from "@prisma/client";
import { injectable } from "inversify";
import {
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
  CreateCourseLessonVideoIds,
  UpdateCourseLessonVideoIds,
  DeleteCourseLessonVideoIds,
} from "../video.type";
import PrismaClientSingleton from "../../../common/class/PrismaClientSingleton";

export interface ICourseLessonVideoRepository {
  delete: (
    ids: DeleteCourseLessonVideoIds,
    video: CourseLessonVideo
  ) => Promise<CourseLessonVideo>;
  update: (
    ids: UpdateCourseLessonVideoIds,
    video: CourseLessonVideo,
    newVideoDetails: UpdateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
  create: (
    ids: CreateCourseLessonVideoIds,
    newVideoDetails: CreateCourseLessonVideoDto
  ) => Promise<CourseLessonVideo>;
}

@injectable()
export class CourseLessonVideoRepository
  implements ICourseLessonVideoRepository
{
  private readonly prisma = PrismaClientSingleton.getInstance();
  private readonly courseLessonVideoTable = this.prisma.courseLessonVideo;

  public async delete(
    ids: DeleteCourseLessonVideoIds,
    video: CourseLessonVideo
  ): Promise<CourseLessonVideo> {
    try {
      const deletedVideo = await this.prisma.$transaction(async (tx) => {
        const [deletedVideo] = await Promise.all([
          tx.courseLessonVideo.delete({
            where: {
              id: ids.videoId,
            },
          }),
          tx.course.update({
            where: {
              id: ids.courseId,
            },
            data: {
              totalVideos: { decrement: 1 },
              totalDurations: { decrement: video.totalDurations },
            },
          }),
          tx.courseLesson.update({
            where: {
              id: ids.lessonId,
            },
            data: {
              totalVideos: { decrement: 1 },
              totalDurations: { decrement: video.totalDurations },
            },
          }),
        ]);

        return deletedVideo;
      });

      return deletedVideo;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    ids: UpdateCourseLessonVideoIds,
    oldVideo: CourseLessonVideo,
    newVideoDetails: UpdateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      const updatedVideo = await this.prisma.$transaction(async (tx) => {
        const [updatedVideo] = await Promise.all([
          tx.courseLessonVideo.update({
            where: {
              id: ids.videoId,
            },
            data: newVideoDetails,
          }),
          tx.courseLesson.update({
            where: {
              id: ids.lessonId,
            },
            data: {
              totalDurations: newVideoDetails.totalDurations
                ? {
                    increment:
                      newVideoDetails.totalDurations - oldVideo.totalDurations,
                  }
                : undefined,
            },
          }),
          tx.course.update({
            where: {
              id: ids.courseId,
            },
            data: {
              totalDurations: newVideoDetails.totalDurations
                ? {
                    increment:
                      newVideoDetails.totalDurations - oldVideo.totalDurations,
                  }
                : undefined,
            },
          }),
        ]);

        return updatedVideo;
      });

      return updatedVideo;
    } catch (error) {
      throw error;
    }
  }

  public async create(
    ids: CreateCourseLessonVideoIds,
    newVideoDetails: CreateCourseLessonVideoDto
  ): Promise<CourseLessonVideo> {
    try {
      const video = await this.prisma.$transaction(async (tx) => {
        const [video] = await Promise.all([
          tx.courseLessonVideo.create({
            data: {
              ...newVideoDetails,
            },
          }),
          tx.course.update({
            where: {
              id: ids.courseId,
            },
            data: {
              totalDurations: { increment: newVideoDetails.totalDurations },
              totalVideos: { increment: 1 },
            },
          }),
          tx.courseLesson.update({
            where: {
              id: ids.lessonId,
            },
            data: {
              totalDurations: { increment: newVideoDetails.totalDurations },
              totalVideos: { increment: 1 },
            },
          }),
        ]);

        return video;
      });

      return video;
    } catch (error) {
      throw error;
    }
  }
}
