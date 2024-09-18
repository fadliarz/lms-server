export const CourseLessonAttachmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_LESSON_ATTACHMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_LESSON_ATTACHMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_LESSON_ATTACHMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_LESSON_ATTACHMENT_AUTHORIZATION"),
} as const;

export type CourseLessonAttachmentModel = {
  id: number;
  name: string;
  description: string | null;
  file: string;
  createdAt: Date;
  updatedAt: Date;
  lessonId: number;
};

export type CourseLessonAttachmentResourceId = {
  courseId: number;
  lessonId: number;
};
