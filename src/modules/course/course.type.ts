import { UserModel } from "../user/user.type";
import { CourseLessonModel } from "../lesson/lesson.type";
import { CourseLessonVideoModel } from "../video/video.type";
import { CourseCategory } from "@prisma/client";

export namespace $CourseAPI {
  const root = "/courses";
  const course = "/courses/:courseId";

  export namespace CreateCourse {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Dto = {
      code: string;
      status: CourseStatusModel;
      image?: string;
      title: string;
      description?: string;
      material?: string;
      categoryId?: number;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace GetCourses {
    export const endpoint = root;
    export const generateUrl = () => endpoint;
    export type Query = {
      include_category?: boolean;
      pageNumber?: number;
      pageSize?: number;
    };
    export type Response = {
      data: (CourseModel & {
        category?: Pick<CourseCategory, "id" | "title"> | null;
      })[];
    };
  }

  export namespace GetCourseById {
    export const endpoint = course;
    export const generateUrl = (courseId: number) => `/courses/${courseId}`;
    export type Query = {
      include_category?: boolean;
      include_lessons?: boolean;
      include_public_videos?: boolean;
    };
    export type Response = {
      data: CourseModel & {
        category?: Pick<CourseCategory, "id" | "title"> | null;
        lessons?: (Pick<
          CourseLessonModel,
          | "id"
          | "title"
          | "description"
          | "totalVideos"
          | "totalDurations"
          | "totalMaterials"
        > & {
          videos?: Pick<
            CourseLessonVideoModel,
            "id" | "name" | "description" | "totalDurations"
          >[];
        })[];
      };
    };
  }

  export namespace UpdateCourse {
    export const endpoint = course;
    export const generateUrl = (courseId: number) => `/courses/${courseId}`;
    export type Dto = {
      image?: string;
      title?: string;
      description?: string;
      material?: string;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace UpdateCourseStatus {
    export const endpoint = `${course}/status`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/status`;
    export type Dto = {
      status: CourseStatusModel;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace UpdateCourseCategoryId {
    export const endpoint = `${course}/category`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/category`;
    export type Dto = {
      categoryId: number;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace UpdateCourseCode {
    export const endpoint = `${course}/code`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/code`;
    export type Dto = {
      code: string;
    };
    export type Response = {
      data: CourseModel;
    };
  }

  export namespace DeleteCourse {
    export const endpoint = course;
    export const generateUrl = (courseId: number) => `/courses/${courseId} `;
    export type Response = {
      data: {};
    };
  }

  export namespace CreateLike {
    export const endpoint = `${course}/likes`;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/likes`;
    export type Dto = {};
    export type Response = {
      data: CourseLikeModel;
    };
  }

  export namespace DeleteLike {
    export const endpoint = `${course}/likes/:likeId`;
    export const generateUrl = (courseId: number, likeId: number) =>
      `/courses/${courseId}/likes/${likeId}`;
    export type Response = {
      data: CourseLikeModel;
    };
  }
}

export const CourseDITypes = {
  REPOSITORY: Symbol.for("COURSE_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_AUTHORIZATION"),
} as const;

export const UserRoleModel = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
} as const;

export type UserRoleModel = (typeof UserRoleModel)[keyof typeof UserRoleModel];

export type CourseModel = {
  id: number;
  code: string;
  status: CourseStatusModel;
  image: string;
  title: string;
  description: string | null;
  material: string | null;
  totalStudents: number;
  totalInstructors: number;
  totalLessons: number;
  totalVideos: number;
  totalDurations: number;
  totalLikes: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number | null;
};

export type CourseLikeModel = {
  id: number;
  courseId: number;
  userId: number;
};

export type CourseStatusModel =
  (typeof CourseStatusModel)[keyof typeof CourseStatusModel];

export const CourseStatusModel = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
} as const;

export const CourseEnrollmentRoleModel = {
  INSTRUCTOR: "INSTRUCTOR",
  STUDENT: "STUDENT",
} as const;

export type CourseEnrollmentRoleModel =
  (typeof CourseEnrollmentRoleModel)[keyof typeof CourseEnrollmentRoleModel];

/**
 *
 *
 * ResourceId
 *
 *
 */

export type CourseResourceId = {
  user: UserModel;
};

export type CourseLikeResourceId = {
  user: UserModel;
  params: { courseId: number };
};
