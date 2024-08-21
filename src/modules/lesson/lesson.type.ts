export namespace $CourseLessonAPI {
  const root = "/courses/:courseId/lessons";
  const lesson = root + "/:lessonId";

  export namespace CreateLesson {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/lessons`;
    export type Dto = {
      title: string;
      description?: string;
    };
    export type Response = {
      data: CourseLessonModel;
    };
  }

  export namespace GetLessons {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/lessons`;
    export type Response = {
      data: CourseLessonModel[];
    };
  }

  export namespace GetLessonById {
    export const endpoint = lesson;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}`;
    export type Response = { data: CourseLessonModel };
  }

  export namespace UpdateLesson {
    export const endpoint = lesson;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}`;
    export type Dto = {
      title: string;
      description?: string;
    };
    export type Response = { data: CourseLessonModel };
  }

  export namespace DeleteLesson {
    export const endpoint = lesson;
    export const generateUrl = (courseId: number, lessonId: number) =>
      `/courses/${courseId}/lessons/${lessonId}`;
    export type Response = { data: {} };
  }
}

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
