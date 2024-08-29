export const CourseLessonDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_LESSON_AUTHORIZATION"),
} as const;

export type CourseLessonModel = {
  id: number;
  title: string;
  description: string | null;
  totalVideos: number;
  totalDurations: number;
  totalMaterials: number;
  createdAt: Date;
  updatedAt: Date;
  courseId: number;
};

export type CourseLessonResourceId = {
  courseId: number;
};
