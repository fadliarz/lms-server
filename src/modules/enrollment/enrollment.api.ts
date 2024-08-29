import { CourseEnrollmentRoleModel } from "../course/course.type";
import { CourseEnrollmentModel } from "./enrollment.type";

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
