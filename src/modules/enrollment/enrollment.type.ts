import { CourseEnrollmentRoleModel } from "../course/course.type";
import { UserModel } from "../user/user.type";

export namespace $CourseEnrollmentAPI {
  const root = "/courses/:courseId/enrollments";
  const enrollment = root + "/:enrollmentId";

  export namespace CreateEnrollment {
    export const endpoint = root;
    export const generateUrl = (courseId: number) =>
      `/courses/${courseId}/enrollments`;
    export type Dto = {
      userId: number;
      role: CourseEnrollmentRoleModel;
    };
    export type Response = {
      data: CourseEnrollmentModel;
    };
  }

  export namespace UpdateEnrollment {
    export const endpoint = enrollment;
    export const generateUrl = (courseId: number, enrollmentId: number) =>
      `/courses/${courseId}/enrollments/${enrollmentId}`;
    export type Dto = {
      role: CourseEnrollmentRoleModel;
    };
    export type Response = {
      data: CourseEnrollmentModel;
    };
  }

  export namespace DeleteEnrollment {
    export const endpoint = enrollment;
    export const generateUrl = (courseId: number, enrollmentId: number) =>
      `/courses/${courseId}/enrollments/${enrollmentId}`;

    export type Response = {
      data: {};
    };
  }
}

export const CourseEnrollmentDITypes = {
  REPOSITORY: Symbol.for("COURSE_ENROLLMENT_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_ENROLLMENT_SERVICE"),
  CONTROLLER: Symbol.for("COURSE_ENROLLMENT_CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_ENROLLMENT_AUTHORIZATION"),
} as const;

export type CourseEnrollmentModel = {
  id: number;
  userId: number;
  courseId: number;
  classId: number | null;
  role: CourseEnrollmentRoleModel;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseEnrollmentResourceId = {
  user: UserModel;
  params: {
    courseId: number;
  };
};
