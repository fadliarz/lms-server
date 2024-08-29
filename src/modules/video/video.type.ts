export const CourseLessonVideoDITypes = {
  REPOSITORY: Symbol.for("COURSE_VIDEO_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_VIDEO_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_VIDEO_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_VIDEO_AUTHORIZATION"),
} as const;

export type CourseLessonVideoModel = {
  id: number;
  name: string;
  description: string | null;
  totalDurations: number;
  youtubeLink: string;
  createdAt: Date;
  updatedAt: Date;
  lessonId: number;
};

export type CourseLessonVideoResourceId = {
  courseId: number;
  lessonId: number;
};
