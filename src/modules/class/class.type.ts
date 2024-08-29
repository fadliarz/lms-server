export const CourseClassDITypes = {
  REPOSITORY: Symbol.for("COURSE_CLASS_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CLASS_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CLASS_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CLASS_AUTHORIZATION"),
} as const;

export type CourseClassModel = {
  id: number;
  title: string;
  courseId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseClassResourceId = {
  courseId: number;
};
