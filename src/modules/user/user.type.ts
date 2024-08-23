import { CourseModel, UserRoleModel } from "../course/course.type";
import { CourseClassAssignmentModel } from "../assignment/assignment.type";
import { CourseScheduleModel } from "../schedule/schedule.type";
import { EventModel } from "../event/event.type";
import { DepartmentModel } from "../department/department.type";
import { DepartmentDivisionModel } from "../division/division.type";
import { ReportModel } from "../report/report.type";
import { PersonalAssignmentModel } from "../personal-assignment/assignment.type";
import { CourseClassAssignmentCompletionModel } from "../assignment-completion/completion.type";
import { DepartmentProgramModel } from "../program/program.type";

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

  export namespace GetUserById {
    export const endpoint = user;
    export const generateUrl = (userId: number) =>
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
    export const generateUrl = (userId: number) =>
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
      };
    };
  }

  export namespace GetUserAssignments {
    export const endpoint = user + "/assignments";
    export const generateUrl = (userId: number) =>
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
    export const generateUrl = (userId: number) =>
      `/users/${userId}/enrolled-courses`;
    export type Response = {
      data: CourseModel[];
    };
  }

  export namespace GetUserManagedCourses {
    export const endpoint = user + "/managed-courses";
    export const generateUrl = (userId: number) =>
      `/users/${userId}/managed-courses`;
    export type Response = {
      data: CourseModel[];
    };
  }

  export namespace GetUserEventAndCourseSchedules {
    export const endpoint = user + "/event-and-course-schedules";
    export const generateUrl = (userId: number) =>
      `/users/${userId}/event-and-course-schedules`;
    export type Response = {
      data: (CourseScheduleModel | EventModel)[];
    };
  }

  export namespace GetUserEnrolledDepartmentPrograms {
    const attribute = "/enrolled-department-division-programs";
    export const endpoint = user + attribute;
    export const generateUrl = (userId: number) =>
      root.concat("/", userId.toString(), attribute);
    export type Response = {
      data: DepartmentProgramModel[];
    };
  }

  export namespace GetUserManagedDepartments {
    const attribute = "managed-departments";
    export const endpoint = `${user}/${attribute}`;
    export const generateUrl = (userId: number) =>
      `/users/${userId}/${attribute}`;
    export type Response = {
      data: DepartmentModel[];
    };
  }

  export namespace GetUserManagedDepartmentDivisions {
    const attribute = "managed-department-divisions";
    export const endpoint = `${user}/${attribute}`;
    export const generateUrl = (userId: number) =>
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
    export const generateUrl = (userId: number) =>
      `/users/${userId}/${attribute}`;
    export type Response = {
      data: ReportModel;
    };
  }

  export namespace UpdateBasicUser {
    export const endpoint = user + "/basic";
    export const generateUrl = (userId: number) => {
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
    export const generateUrl = (userId: number) => {
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
    export const generateUrl = (userId: number) =>
      root.concat("/", userId.toString(), "/password");
    export type Dto = { password: string };
    export type Response = { data: PublicUserModel };
  }

  export namespace UpdateUserRole {
    export const endpoint = user + "/role";
    export const generateUrl = (userId: number) =>
      root.concat("/", userId.toString(), "/role");
    export type Dto = { role: UserRoleModel };
    export type Response = { data: PublicUserModel };
  }

  export namespace UpdateUserPhoneNumber {
    export const endpoint = user + "/phone";
    export const generateUrl = (userId: number) =>
      root.concat("/", userId.toString(), "/phone");
    export type Dto = { phoneNumber: string };
    export type Response = { data: PublicUserModel };
  }

  export namespace DeleteUser {
    export const endpoint = user;
    export const generateUrl = (userId: number) =>
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

export const UserDITypes = {
  REPOSITORY: Symbol.for("USER_REPOSITORY"),
  SERVICE: Symbol.for("USER_SERVICE"),
  CONTROLLER: Symbol.for("USER_CONTROLLER"),
  AUTHORIZATION: Symbol.for("USER_AUTHORIZATION"),
} as const;

export type UserModel = {
  id: number;
  email: string;
  password: string;
  accessToken: string | null;
  refreshToken: string[];
  phoneNumber: string;
  name: string;
  NIM: string;
  avatar: string;
  about: string | null;
  totalCourses: number;
  totalLessons: number;
  totalUnreadMessages: number;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoleModel;
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

export type PublicUserModel = Omit<
  UserModel,
  "accessToken" | "refreshToken" | "password"
>;

export const PrivilegeModel = {
  DEPARTMENT: "DEPARTMENT",
  DIVISION: "DIVISION",
  PROGRAM: "PROGRAM",
  SCHOLARSHIP: "SCHOLARSHIP",
  COMPETITION: "COMPETITION",
  REPORT: "REPORT",
  COURSE: "COURSE",
  EVENT: "EVENT",
} as const;

export type PrivilegeModel =
  (typeof PrivilegeModel)[keyof typeof PrivilegeModel];
