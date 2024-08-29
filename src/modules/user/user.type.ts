import { UserRoleModel } from "../course/course.type";

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
  STORE: "STORE",
} as const;

export type PrivilegeModel =
  (typeof PrivilegeModel)[keyof typeof PrivilegeModel];
