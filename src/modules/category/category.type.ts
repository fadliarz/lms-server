export const CourseCategoryDITypes = {
  REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CATEGORY_AUTHORIZATION"),
};

export type CourseCategoryModel = {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
