export namespace $CourseClassAPI {
  const root = "/courses/:courseId/classes";
  const theClass = root + "/:classId";

  export namespace CreateClass {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/classes`;
    export type Dto = {
      title: string;
    };
    export type Response = {
      data: CourseClassModel;
    };
  }

  export namespace GetClasses {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/classes`;
    export type Response = {
      data: CourseClassModel[];
    };
  }

  export namespace GetClassById {
    export const endpoint = theClass;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}`;
    export type Response = {
      data: CourseClassModel;
    };
  }

  export namespace UpdateClass {
    export const endpoint = theClass;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}`;
    export type Dto = {
      title?: string;
    };
    export type Response = {
      data: CourseClassModel;
    };
  }

  export namespace DeleteClass {
    export const endpoint = theClass;
    export const generateUrl = (courseId: number, classId: number) =>
      `/courses/${courseId}/classes/${classId}`;
    export type Response = {
      data: {};
    };
  }
}

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
