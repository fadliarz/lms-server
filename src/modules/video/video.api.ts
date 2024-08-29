import { CourseLessonVideoModel } from "./video.type";

export namespace $CourseLessonVideoAPI {
  const root = "/courses/:courseId/lessons/:lessonId/videos";
  const video = root + "/:videoId";

  export namespace CreateVideo {
    export const endpoint = root;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}/videos`;
    export type Dto = {
      name: string;
      youtubeLink: string;
      totalDurations: number;
      description?: string;
    };
    export type Response = {
      data: CourseLessonVideoModel;
    };
  }

  export namespace GetVideos {
    export const endpoint = root;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}/videos`;
    export type Response = {
      data: CourseLessonVideoModel[];
    };
  }

  export namespace GetVideoById {
    export const endpoint = video;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      videoId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`;
    export type Response = {
      data: CourseLessonVideoModel;
    };
  }

  export namespace UpdateVideo {
    export const endpoint = video;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      videoId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`;
    export type Dto = {
      name?: string;
      description?: string;
    };
    export type Response = {
      data: CourseLessonVideoModel;
    };
  }

  export namespace UpdateVideoSource {
    export const endpoint = `${video}/basic`;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      videoId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}/basic`;
    export type Dto = {
      youtubeLink: string;
      totalDurations: number;
    };
    export type Response = {
      data: CourseLessonVideoModel;
    };
  }

  export namespace DeleteVideo {
    export const endpoint = video;
    export const generateUrl = (
      courseId: number,
      lessonId: number,
      videoId: number,
    ) => `/courses/${courseId}/lessons/${lessonId}/videos/${videoId}`;
    export type Response = {
      data: {};
    };
  }
}
