import { PersonalAssignmentModel } from "../personal-assignment/assignment.type";
import { CourseClassAssignmentModel } from "../assignment/assignment.type";
import { CourseClassAssignmentCompletionModel } from "../assignment-completion/completion.type";
import { CourseModel, UserRoleModel } from "../course/course.type";
import { CourseScheduleModel } from "../schedule/schedule.type";
import { EventModel } from "../event/event.type";
import { DepartmentProgramModel } from "../program/program.type";
import { DepartmentModel } from "../department/department.type";
import { DepartmentDivisionModel } from "../division/division.type";
import { ReportModel } from "../report/report.type";
import { PublicUserModel, UserModel } from "./user.type";
import { OrderModel } from "../order/order.type";
import { ProductVariantModel } from "../product-variant/variant.type";

export namespace $UserAPI {
  const root = "/users";
  const user = root + "/:userId";

  export namespace CreateUser {
    export const endpoint = root;
    export const generateUrl = () => {
      return root;
    };
    export type Dto = {
      email: string;
      password: string;
      phoneNumber: string;
      name: string;
      NIM: string;
      avatar?: string;
      about?: string;
      dateOfBirth: Date;
      address: string;
      bloodType: string;
      medicalHistories: string;
      HMM: string;
      UKM: string;
      hobbies: string;
      lineId: string;
      emergencyNumber: string;
    };
    export type Response = {
      data: PublicUserModel;
    };
  }

  export namespace GetPublicUsers {
    export const endpoint = "/public-users";
    export const generateUrl = () => endpoint;
    export type Query = {
      pageSize?: number | undefined;
      pageNumber?: number | undefined;
    };
    export type Response = {
      data: Pick<UserModel, "id" | "NIM" | "name" | "avatar">[];
    };
  }

  export namespace GetUserById {
    export const endpoint = user;
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString());
    export type Response = { data: PublicUserModel };
  }

  export namespace GetMe {
    export const endpoint = "/get-me";
    export const generateUrl = () => endpoint;
    export type Response = { data: PublicUserModel };
  }

  export namespace GetUserPermissions {
    export const endpoint = user + "/permissions";
    export const generateUrl = (userId: string) =>
      `/users/${userId}/permissions`;
    export type Response = {
      data: {
        programEnrollment: {
          manage: boolean;
        };
        event: {
          manage: boolean;
        };
        category: {
          manage: boolean;
        };
        course: {
          manage_the_course: boolean;
          manage_course_content: boolean;
        };
        competition: {
          manage: boolean;
        };
        scholarship: {
          manage: boolean;
        };
        report: {
          manage: boolean;
        };
        store: {
          manage: boolean;
        };
      };
    };
  }

  export namespace GetUserAssignments {
    export const endpoint = user + "/assignments";
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString(), "/assignments");
    export type Response = {
      data: (
        | { type: "personal"; assignment: PersonalAssignmentModel }
        | {
            type: "course";
            assignment: CourseClassAssignmentModel & {
              course: { id: number; title: string };
              class: { id: number; title: string };
              completion: CourseClassAssignmentCompletionModel | null;
            };
          }
      )[];
    };
  }

  export namespace GetUserEnrolledAsStudentCourses {
    export const endpoint = user + "/enrolled-courses";
    export const generateUrl = (userId: string) =>
      `/users/${userId}/enrolled-courses`;
    export type Response = {
      data: CourseModel[];
    };
  }

  export namespace GetUserManagedCourses {
    export const endpoint = user + "/managed-courses";
    export const generateUrl = (userId: string) =>
      `/users/${userId}/managed-courses`;
    export type Response = {
      data: CourseModel[];
    };
  }

  export namespace GetUserEventAndCourseSchedules {
    export const endpoint = user + "/event-and-course-schedules";
    export const generateUrl = (userId: string) =>
      `/users/${userId}/event-and-course-schedules`;
    export type Response = {
      data: (CourseScheduleModel | EventModel)[];
    };
  }

  export namespace GetUserEnrolledDepartmentPrograms {
    const attribute = "/enrolled-department-division-programs";
    export const endpoint = user + attribute;
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString(), attribute);
    export type Response = {
      data: DepartmentProgramModel[];
    };
  }

  export namespace GetUserManagedDepartments {
    const attribute = "managed-departments";
    export const endpoint = `${user}/${attribute}`;
    export const generateUrl = (userId: string) =>
      `/users/${userId}/${attribute}`;
    export type Response = {
      data: DepartmentModel[];
    };
  }

  export namespace GetUserManagedDepartmentDivisions {
    const attribute = "managed-department-divisions";
    export const endpoint = `${user}/${attribute}`;
    export const generateUrl = (userId: string) =>
      `/users/${userId}/${attribute}`;
    export type Response = {
      data: (DepartmentDivisionModel & {
        department: { id: number; title: string };
      })[];
    };
  }

  export namespace GetUserReport {
    const attribute = "report";
    export const endpoint = `${user}/${attribute}`;
    export const generateUrl = (userId: string) =>
      `/users/${userId}/${attribute}`;
    export type Response = {
      data: ReportModel;
    };
  }

  export namespace GetUserOrders {
    const attribute = "orders";
    export const endpoint = `${user}/${attribute}`;
    export const generateUrl = (userId: string) =>
      `/users/${userId}/${attribute}`;
    export type Response = {
      data: (OrderModel & { variant: ProductVariantModel })[];
    };
  }

  export namespace GetDepartmentProgramsWithEnrollmentInformation {
    export const endpoint = `${user}/departments/:departmentId/programs`;
    export const generateUrl = (userId: string, departmentId: number) =>
      `/users/${userId}/departments/${departmentId}/programs`;
    export type Response = {
      data: (DepartmentProgramModel & { isEnrolled: boolean })[];
    };
  }

  export namespace UpdateBasicUser {
    export const endpoint = user + "/basic";
    export const generateUrl = (userId: string) => {
      return root.concat("/", userId.toString(), "/basic");
    };
    export type Dto = Omit<
      Partial<CreateUser.Dto>,
      "email" | "password" | "phoneNumber"
    >;
    export type Response = {
      data: PublicUserModel;
    };
  }

  export namespace UpdateUserEmail {
    export const endpoint = user + "/email";
    export const generateUrl = (userId: string) => {
      return root.concat("/", userId.toString(), "/email");
    };
    export type Dto = {
      email: string;
    };
    export type Response = {
      data: PublicUserModel;
    };
  }

  export namespace UpdateUserPassword {
    export const endpoint = user + "/password";
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString(), "/password");
    export type Dto = { password: string };
    export type Response = { data: PublicUserModel };
  }

  export namespace UpdateUserRole {
    export const endpoint = user + "/role";
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString(), "/role");
    export type Dto = { role: UserRoleModel };
    export type Response = { data: PublicUserModel };
  }

  export namespace UpdateUserPhoneNumber {
    export const endpoint = user + "/phone";
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString(), "/phone");
    export type Dto = { phoneNumber: string };
    export type Response = { data: PublicUserModel };
  }

  export namespace DeleteUser {
    export const endpoint = user;
    export const generateUrl = (userId: string) =>
      root.concat("/", userId.toString());
    export type Response = { data: {} };
  }

  export namespace SignIn {
    export const endpoint = root + "/signin";
    export const generateUrl = () => endpoint;
    export type Dto = Pick<CreateUser.Dto, "email" | "password">;
    export type Response = { data: {} };
  }

  export namespace SignOut {
    export const endpoint = root + "/signout";
    export const generateUrl = () => endpoint;
    export type Response = { data: {} };
  }
}
